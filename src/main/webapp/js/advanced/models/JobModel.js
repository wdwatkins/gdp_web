/*jslint browser: true*/
/*global Backbone*/
/*global _*/
var GDP = GDP || {};
(function(){
	"use strict;";

    GDP.ADVANCED = GDP.ADVANCED || {};

    GDP.ADVANCED.model = GDP.ADVANCED.model || {};

    var Job = Backbone.Model.extend({
		defaults: {
			//data detailsL
			dataSourceUrl : null,
			invalidDataSourceUrl : true,
			dataSourceVariables : new GDP.ADVANCED.model.DataSourceVariables(),

			//the earliest date the user can select
			minDate: null,

			//the latest date the user can select
			maxDate: null,

			//the dates the user actually selected
			startDate: null,
			endDate: null,

			//spatial details:
			aoiName : '',
			aoiExtent : null, // will be the extent of the layer aoiName
			aoiAttribute : '',
			aoiAttributeValues : [],

			//ows identifier for the algorithm. Ex: gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm
			processes: new GDP.ADVANCED.collection.Processes(),
			algorithmId: null,

			processVariables : new GDP.ADVANCED.model.ProcessVariablesModel(), // These will vary depending on the process algorithm selected

			email : '',
			filename : ''
		},

		getSelectedAlgorithmProcess : function() {
			return this.get('processes').findWhere({'id' : this.get('algorithmId')});
		},

		getSelectedDataSourceVariables : function() {
			return this.get('dataSourceVariables').where({'selected' : true});
		},

		getProcessInputs : function() {
			var algorithm = this.getSelectedAlgorithmProcess();
			if (algorithm) {
				return _.reject(algorithm.get('inputs'), function(input) {
					return (['FEATURE_COLLECTION', 'DATASET_URI', 'DATASET_ID', 'TIME_START', 'TIME_END', 'FEATURE_ATTRIBUTE_NAME'].indexOf(input.identifier) !== -1);
				});
			}
			else {
				return null;
			}
		},

		/*
		 *
		 * @returns {Object} where each property represents a simple input to the WPS process. Each property value
		 * is an array.
		 */
		getWPSStringInputs : function() {
			var getISODate = function(dateStr) {
				return dateStr.replace(/\//g, '-') + 'T00:00:00.000Z';
			};

			var result = {
				FEATURE_ATTRIBUTE_NAME : [this.get('aoiAttribute')],
				DATASET_URI : [this.get('dataSourceUrl')],
				DATASET_ID : _.map(this.getSelectedDataSourceVariables(), function(model) {
					return model.get('value');
				}),
				TIME_START : [getISODate(this.get('startDate'))],
				TIME_END : [getISODate(this.get('endDate'))]
			};

			var processVars = {};
			_.each(this.get('processVariables').attributes, function(value, key) {
				if (_.isArray(value)) {
					processVars[key] = value;
				}
				else {
					return processVars[key] = [value];
				}
			})
			_.extend(result, processVars);
			return result;
		},

		/*
		 * @returns {jquery.Deferred.promise}. If successful it will return an Array containing the feature Ids.
		 */
		getSelectedFeatureIds : function() {
			var name = this.get('aoiName');
			var attribute = this.get('aoiAttribute');
			var values = this.get('aoiAttributeValues');

			var deferred = $.Deferred();
			if ((name) && (attribute) && (values.length > 0)) {
				GDP.OGC.WFS.callWFS({
					request : 'GetFeature',
					typename : name,
					propertyname : attribute,
					cql_filter : GDP.util.mapUtils.createAOICQLFilter(attribute, values),
					maxFeatures : 5001
				}, 'POST').done(function(data) {
					// parse gml ids from result
					var name_tag = name.substr(name.indexOf(':') + 1);
					var result = [];
					($(data).find(name_tag).each(function() {
						result.push($(this).attr('gml:id'));
					}));
					deferred.resolve(result);
				}).fail(function() {
					GDP.logger.error('Get Selected features failed');
					deferred.resolve([]);
				});
			}
			else {
				deferred.resolve([]);
			}
			return deferred.promise();
		},

		getMimeType : function() {
			var mimeType
			var delimiter = this.get('processVariables').get('DELIMITER');
			if (delimiter === 'TAB') {
				mimeType = 'text/tab-separated-values';
			}
			else if (delimiter === 'SPACE') {
				mimeType = 'text/plain';
			}
			else {
				mimeType = 'text/csv';
			}
			return mimeType;
		},

		/*
		 * @param {String} geomProperty - Defaults to 'the_geom'
		 * @param {String} srs - Defaults to not specifying the srsName attribute.
		 * @returns $.Deferred.promise. This promise will be resolved with the xml string document as the data.
		 */
		getWPSXMLInputs : function(geomProperty, srs) {
			var name = this.get('aoiName');
			var attribute = this.get('aoiAttribute');
			var result = '<wfs:GetFeature ' +
                  'service="WFS" ' +
                  'version="1.1.0" ' +
                  'outputFormat="text/xml; subtype=gml/3.1.1" ' +
                  'xmlns:wfs="http://www.opengis.net/wfs" ' +
                  'xmlns:ogc="http://www.opengis.net/ogc" ' +
                  'xmlns:gml="http://www.opengis.net/gml" ' +
                  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                  'xsi:schemaLocation="http://www.opengis.net/wfs ../wfs/1.1.0/WFS.xsd"> ' +
				  '<wfs:Query typeName="' + name + '" ' + ((srs) ? 'srsName="' + srs + '"' : '') + '> ' +
                 '<wfs:PropertyName>'  +
				 (srs ? 'srsName="' + srs + '"' : '') +
				'</wfs:PropertyName> ' +
                 '<wfs:PropertyName>' + attribute + '</wfs:PropertyName>';

			var deferred = $.Deferred();
			this.getSelectedFeatureIds().done(function(ids) {
				if (ids[0] !== '*') {
					result += '<ogc:Filter>';
					_.each(ids, function(id) {
						result += '<ogc:GmlObjectId gml:id="' + id + '"/>';
					});
					result += '</ogc:Filter>';
				}

				result += '</wfs:Query> </wfs:GetFeature>';
				deferred.resolve(result);
			});
			return deferred.promise();
		},

		/*
		 * @returns array of error messages. An empty array is returned if the data is fully specified for spatial.
		 */
		spatialReadyForProcessing : function() {
			var result = [];
			if (!(this.get('aoiName'))) {
				result.push('Select or upload an area of interest and select features.');


			}
			else if (!(this.get('aoiAttribute')) || !(this.get('aoiAttributeValues'))) {
				result.push('Select a feature within the area of interest.');
			}
			return result;
		},

		/*
		 * @returns array of error messages. An empty array is returned if the data is fully specified for data details.
		 */
		dataDetailsReadyForProcessing : function() {
			var result = [];
			if (this.get('invalidDataSourceUrl')) {
				result.push('Enter a valid data source url and select variables.');
			}
			else {
				if (this.getSelectedDataSourceVariables().length === 0) {
					result.push('Select at least one variable');
				}
				if (!this.get('startDate') && !this.get('endDate')) {
					result.push('Set a start and end date.');
				}
			}
			return result;
		},

		/*
		 * @returns array of error messages. An empty array is returned if the data is fully specified for algorithm.
		 */
		algorithmReadyForProcessing : function() {
			var result = [];
			if (!this.get('algorithmId')) {
				result.push('Select an algorithm to process the data.');
			}
			var processVariables = this.get('processVariables').attributes;
			_.each(processVariables, function(value, key) {
				if (!value) {
					result.push(key + ' must have a value.');
				};
			});
			return result;
		},

		/*
		 * @return {Object} with property for each page in hub. Each property's value will be an array of error messages.
		 * If no errors for that page the array will be empty.
		 */
		readyForProcessing : function() {
			var result = {
				spatial : this.spatialReadyForProcessing(),
				dataDetails : this.dataDetailsReadyForProcessing(),
				algorithm : this.algorithmReadyForProcessing()
			};
			return result;
		}
    });
    GDP.ADVANCED.model.Job = Job;
}());