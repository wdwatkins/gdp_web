/*jslint browser: true*/
/*global Backbone*/
/*global _*/
var GDP = GDP || {};
(function(){
    "use strict";
    GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

    GDP.PROCESS_CLIENT.model = GDP.PROCESS_CLIENT.model || {};

	var VARIABLE_WPS_PROCESS_ID = 'gov.usgs.cida.gdp.wps.algorithm.discovery.ListOpendapGrids';
	var DATE_RANGE_WPS_PROCESS_ID = 'gov.usgs.cida.gdp.wps.algorithm.discovery.GetGridTimeRange';

    var DataSourceVariable = Backbone.Model.extend({
		defaults:{
			name : '',
			description : '',
			unitsstring : ''
		}
	});

    var DataSourceVariables = Backbone.Collection.extend({
		model: DataSourceVariable,

		fetch : function(options) {
			var self = this;
			var deferred = $.Deferred();
			var wpsInputs = {
				"catalog-url": [options.dataSourceUrl],
				"allow-cached-response": [options.allow_cached]
			};
			var wpsOutput = ["result_as_json"];

			GDP.wpsClient.sendWpsExecuteRequest(
				GDP.config.get('application').endpoints.utilityWps + '/WebProcessingService',
				VARIABLE_WPS_PROCESS_ID,
				wpsInputs,
				wpsOutput,
				false,
				null,
				true,
				'json',
				'application/json'
			).done(function(response) {
				var dataCollection;
				if (response && _.has(response, 'datatypecollection') && _.has(response.datatypecollection, 'types')) {
					if (_.has(response.datatypecollection.types, 'length')) {
						dataCollection = response.datatypecollection.types;
					}
					else {
						dataCollection = [response.datatypecollection.types];
					}
					// Need to retrieve dates now. The dates are the same for all variables so use the first in the list
					self.add(_.map(dataCollection, function(c) {
						return {
							name : c.name,
							description : c.description,
							unitsstring : c.unitsstring
						};
					}));
					deferred.resolve();
				}
				else {
					deferred.reject(VARIABLE_WPS_PROCESS_ID + ' : Invalid wps response received');
				}
			}).fail(function(jqXHR, textStatus) {
				deferred.reject(VARIABLE_WPS_PROCESS_ID + ' : Service request failed with ' + textStatus);
			});

			return deferred.promise();
		}
    });

	var DataSourceModel =  Backbone.Model.extend({
		defaults : {
			url : '',
			variables : new DataSourceVariables(),
			dateRange : {
				minDate : '',
				maxDate : ''
			}
		},

		getDateRange : function(options) {
			// date range is the same for all variables, so just use the first one in the collection
			var self = this;
			var deferred = $.Deferred();
			var wpsInputs = {
				"catalog-url": [this.get('url')],
				"allow-cached-response": [options.allowCached],
				"grid": [this.get('variables').at(0).get('name')]
			};
			var wpsOutput = ["result_as_json"];

			var hasExpectedDateProperties = function(obj) {
				var expectedProperties = ['year','month','day'];
				var hasExpectedNumericProperties = true;

				if (_.isObject(obj)) {
					var picked = _.pick(obj, expectedProperties);
					if(_.keys(picked).length !== expectedProperties.length){
						hasExpectedNumericProperties = false;
					}
					else {
						var valuesAreNumeric = _.chain(picked).values().every(_.isNumber).value();
						if(!valuesAreNumeric){
							hasExpectedNumericProperties = false;
						}
					}
				}
				else{
					hasExpectedNumericProperties = false;
				}
				return hasExpectedNumericProperties;
			};

			GDP.wpsClient.sendWpsExecuteRequest(
				GDP.config.get('application').endpoints.utilityWps + '/WebProcessingService',
				DATE_RANGE_WPS_PROCESS_ID,
				wpsInputs,
				wpsOutput,
				false,
				null,
				true,
				'json',
				'application/json'
			).done(function(response) {
				var starttime, endtime;
				if (_.has(response, 'availabletimes') && _.has(response.availabletimes, 'starttime') &&
					_.has(response.availabletimes, 'endtime')  &&
					hasExpectedDateProperties(response.availabletimes.starttime) &&
					hasExpectedDateProperties(response.availabletimes.endtime)) {

					starttime = response.availabletimes.starttime;
					endtime = response.availabletimes.endtime;

					self.set('dateRange', {
						start : starttime.month + '/'  + starttime.day + '/' + starttime.year,
						end : endtime.month + '/'  + endtime.day + '/' + endtime.year
					});

					deferred.resolve();
				}
				else {
					deferred.reject(DATE_RANGE_WPS_PROCESS_ID + ' : Invalid response received');
				}
			}).fail(function(jqXHR, textStatus) {
				deferred.reject(DATE_RANGE_WPS_PROCESS_ID + ' : Service call failed: ' + textStatus);
			});

			return deferred.promise();
		},

		fetch : function(options) {
			var self = this;
			var deferred = $.Deferred();
			var variables = new DataSourceVariables();
			this.set('url', options.dataSourceUrl);

			variables.fetch(options).done(function() {
				self.set('variables', variables);
				self.getDateRange({
					allowCache : options.allowCache
				}).done(function() {
					deferred.resolve();
				}).fail(function(msg) {
					deferred.reject(msg);
				});
			}).fail(function(msg) {
				deferred.reject(msg);
			});
			return deferred.promise();
		}
	});

    GDP.PROCESS_CLIENT.model.DataSourceVariable = DataSourceVariable;
    GDP.PROCESS_CLIENT.model.DataSourceVariables = DataSourceVariables;
	GDP.PROCESS_CLIENT.model.DataSourceModel = DataSourceModel;
}());