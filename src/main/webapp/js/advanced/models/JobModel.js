/*jslint browser: true*/
/*global Backbone*/
/*global _*/
var GDP = GDP || {};
(function(){
	"use strict";

    GDP.ADVANCED = GDP.ADVANCED || {};

    GDP.ADVANCED.model = GDP.ADVANCED.model || {};

    var Job = Backbone.Model.extend({
		defaults: {
			//data details
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

		/*
		 * Returns the process model for the model's algorithmId. If nothing matches, will return undefined
		 * @returns {GDP.ADVANCED.model.Process}
		 */
		getSelectedAlgorithmProcess : function() {
			return this.get('processes').findWhere({'id' : this.get('algorithmId')});
		},

		/*
		 * Returns a promise which when resolved contains the url to use for the WCS coverage service. Will
		 * return the empty string if this can't be determined.
		 * @returns {$.Deferred.promise}.
		 */
		getWCSDataSourceUrl : function() {
			var deferred = $.Deferred();
			var dataSourceUrl = this.get('dataSourceUrl');

			var uri;
			if (dataSourceUrl) {
				uri = GDP.util.parseUri(dataSourceUrl);

				if (uri.protocol === '') {
					// initially assume http
					dataSourceUrl = dataSourceUrl.replace(/^/, 'http://');
					uri.protocol = 'http';
				}

				// TODO: need a cleaner way of testing service type and failing over
				// to a different service
				if (uri.protocol === 'http' || uri.protocol === 'https') {
					// Try wcs first. If it doesn't succeed, try opendap.
					$.ajax({
						url: dataSourceUrl,
						data : {
							request : 'GetCapabilities',
							version : '1.1.1'
						},
						success : function(data) {
							deferred.resolve(dataSourceUrl);
						},
						error : function() {
							//Assume that opendap is used
							dataSourceUrl = dataSourceUrl.replace(/^(http|https):\/\//, 'dods://');
							deferred.resolve(dataSourceUrl);
						}
					});
				}
				else if (uri.protocol === 'dods') {
					deferred.resolve(dataSourceUrl);
				}
				else {
					GDP.logger.error('dataSourceUrl has an unknown dataset protocol: '  + uri.protocol);
					deferred.resolve('');
				}
			}
			else {
				deferred.resolve('');
			}
			return deferred.promise();
		},

		/*
		 * Return the data source variables whose selected attribute is true.
		 * @returns {Array of GDP.ADVANCED.model.DataSourceVariables}
		 */
		getSelectedDataSourceVariables : function() {
			return this.get('dataSourceVariables').where({'selected' : true});
		},

		/*
		 * Returns the inputs that are comprise the inputs to be used as processVariables.
		 * @returns {Object} or null if no algorithm has been selected
		 */
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
		 * Returns a promise where resolve data is an {Object} where each property represents a simple input to the WPS process.
		 *     Each property value is an array.
		 * @returns $.Deferred.promise.
		 */
		getWPSStringInputs : function() {
			var getISODate = function(dateStr){
				var date = new Date(dateStr);
				return (new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))).toISOString();
			};

			var aoiAttribute = this.get('aoiAttribute');

			var deferred = $.Deferred();

			var getDataSourceUrl = this.getWCSDataSourceUrl();

			var result = {
				FEATURE_ATTRIBUTE_NAME : [aoiAttribute ],
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
			});
			_.extend(result, processVars);

			getDataSourceUrl.done(function(url) {
				result.DATASET_URI = [url];
				deferred.resolve(result);
			});
			return deferred.promise();
		},

		/*
		 * Returns a promise which resolves with an array containing the feature ids that have been selected.
		 * @returns {jquery.Deferred.promise}.
		 */
		getSelectedFeatureIds : function() {
			var name = this.get('aoiName');
			var attribute = this.get('aoiAttribute');
			var values = this.get('aoiAttributeValues');

			var deferred = $.Deferred();
			if ((name) && (attribute) && (_.first(values) !== '*')) {
				GDP.OGC.WFS.callWFS({
					request : 'GetFeature',
					typename : name,
					propertyname : attribute,
					cql_filter : GDP.util.mapUtils.createCQLFilter(attribute, values),
					maxFeatures : 5001
				}, 'POST').done(function(data) {
					var result = [];
					GDP.util.findXMLNamespaceTags($(data), name).each(function() {
						result.push($(this).attr('gml:id'));
					});
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

		/*
		 *
		 * @returns {String} - represents the mimeType of the current Job. Note that this can be the empty string
		 */
		getMimeType : function() {
			var mimeType = '';
			var delimiter = this.get('processVariables').get('DELIMITER');
			if (delimiter === 'TAB') {
				mimeType = 'text/tab-separated-values';
			}
			else if (delimiter === 'SPACE') {
				mimeType = 'text/plain';
			}
			else if (delimiter === 'COMMA') {
				mimeType = 'text/csv';
			}
			return mimeType;
		},

		/*
		 * @param {String} geomProperty - Defaults to 'the_geom'
		 * @param {String} srs - Defaults to not specifying the srsName attribute.
		 * @returns {$.Deferred.promise}. This promise will be resolved with the xml string document as the data.
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
				  '<wfs:PropertyName>' + (geomProperty ? geomProperty : 'the_geom') + '</wfs:PropertyName> ' +
                 '<wfs:PropertyName>' + (attribute ? attribute :  'ID') + '</wfs:PropertyName>';

			var deferred = $.Deferred();
			this.getSelectedFeatureIds().done(function(ids) {
				if (ids.length > 0) {
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
		 * @returns {Array of String} of error messages. An empty array is returned if the data is fully specified for spatial.
		 */
		spatialErrorMessages : function() {
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
		 * @returns {Array of String} of error messages. An empty array is returned if the data is fully specified for data details.
		 */
		dataDetailsErrorMessages : function() {
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
		 * @returns {Array of String} of error messages. An empty array is returned if the data is fully specified for algorithm.
		 */
		algorithmErrorMessages : function() {
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
		jobErrorMessages : function() {
			var result = {
				spatial : this.spatialErrorMessages(),
				dataDetails : this.dataDetailsErrorMessages(),
				algorithm : this.algorithmErrorMessages()
			};
			return result;
		}
    });
    GDP.ADVANCED.model.Job = Job;
}());