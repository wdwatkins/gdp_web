/*jslint browser: true*/
/*global Backbone*/
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

		getWPSStringInputs : function() {
			var result = {};
			return result;
		},

		/*
		 *
		 * @returns {jquery.Deferred}. If successful it will return an Array containing the feature Ids.
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
			return deferred;
		},

		getWPSXMLInputs : function() {
			result = '';
			return result;
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
				var selectedVars = this.get('dataSourceVariables').where({'selected' : true});
				if (selectedVars.length === 0) {
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