/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};
(function(){
	"use strict;"

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
		}
    });
    GDP.ADVANCED.model.Job = Job;
}());