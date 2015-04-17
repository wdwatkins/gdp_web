/*jslint browser: true*/
/*global _,jQuery*/
var GDP = GDP || {};
(function(_, $){
    "use strict";
    GDP.ADVANCED= GDP.ADVANCED || {};
    GDP.ADVANCED.view = GDP.ADVANCED.view || {};
    var variablePicker  = {
	selector : '#data-source-vars',
	$el: null
    };
    var datePickers = {
	start : {
	    selector:'#start-date',
	    $el: null
	},
	end : {
	    selector: '#end-date',
	    $el: null
	}
    };
    var urlPicker = {
	selector: '#data-source-url',
	$el: null
    };
	var VARIABLE_WPS_PROCESS_ID = 'gov.usgs.cida.gdp.wps.algorithm.discovery.ListOpendapGrids';
	var DATE_RANGE_WPS_PROCESS_ID = 'gov.usgs.cida.gdp.wps.algorithm.discovery.GetGridTimeRange';
    
    GDP.ADVANCED.view.DataDetailsView = GDP.util.BaseView.extend({
	'events' : (function(){
	    var ret = {};
	    ret['change ' + variablePicker.selector] = 'selectVariables';
	    ret['change ' + urlPicker.selector] = 'changeUrl';
		ret['changeDate ' + datePickers.start.selector] = 'changeStartDate';
		ret['changeDate ' + datePickers.end.selector] = 'changeEndDate';
	    return ret;
	}()),
	'wps' : null,
	'initialize': function(options) {
	    this.wps = options.wps;
	    this.wpsEndpoint = options.wpsEndpoint;
	    //super
	    GDP.util.BaseView.prototype.initialize.apply(this, arguments);
	},
	'render' : function () {
	    this.$el.html(this.template({
		url : this.model.get('dataSourceUrl'),
		variables : this.model.get('dataSourceVariables'),
		invalidUrl : this.model.get('invalidDataSourceUrl')
	    }));
		
	    datePickers.start.$el = $(datePickers.start.selector);
	    datePickers.end.$el = $(datePickers.end.selector);
	    urlPicker.$el = $(urlPicker.selector);
		variablePicker.$el = $(variablePicker.selector);
		
		//actual user selection
		var userStartDate = this.model.get('startDate');
		var userEndDate = this.model.get('endDate');
		
		//bounds on user selection
		var minDate = this.model.get('minDate');
		var maxDate = this.model.get('maxDate');
		
		var startDatePicker = datePickers.start.$el.datepicker();
		if(null === userStartDate){
			startDatePicker.datepicker('clearDates');
		}else{
			startDatePicker.datepicker('setDate', userStartDate);
			startDatePicker.datepicker('setStartDate', minDate);
			startDatePicker.datepicker('setEndDate', userEndDate);
		}

		var endDatePicker = datePickers.end.$el.datepicker();
		if(null === userEndDate){
			endDatePicker.datepicker('clearDates');
		}
		else{
			endDatePicker.datepicker('setDate', userEndDate);
			endDatePicker.datepicker('setStartDate', userStartDate);
			endDatePicker.datepicker('setEndDate', maxDate);
		}
		return this;
	},
	'dateModelProperties' : ['minDate', 'startDate', 'maxDate', 'endDate'],
	'resetDates': function(){
		var self = this;
		_.each(this.dateModelProperties, function(dateProp){
			self.model.set(dateProp, null);
		});
	},
	'selectVariables': function (ev) {
		var variables = _.map(ev.target.options, function (option) {
			return {
				'text': option.text,
				'value': option.value,
				'selected': option.selected
			};
		});

		this.model.get('dataSourceVariables').reset(variables);
		this.render();
	},
	/**
	 * Reacts to a change in url
	 * 
	 * @param {jQuery} ev a jQuery change event for the target field
	 * expects url to be at ev.target.value
	 * @returns {jQuery.Deferred.promise} The promise is resolved with no args 
	 * if user cleared the url or if user submitted a url and all subesequent 
	 * web service calls succeded. The promise is rejected with an error message
	 * if any web service calls fail, or if the web service responses cannot be
	 * parsed.
	 */
	'changeUrl': function (ev) {
		var self = this,
		value = ev.target.value,
		deferred = $.Deferred();
		this.model.set('dataSourceUrl', value);
		if (!(_.isNull(value) || _.isUndefined(value) || _.isEmpty(value))) {
			this.getGrids(value).done(function(catalogUrl, gridName){
				var dateRangePromise = self.getDateRange(catalogUrl, gridName);
				dateRangePromise.then(function(){
					deferred.resolve.apply(this, arguments);
				}, function(){
					deferred.reject.apply(this, arguments);
				});
			}).fail(function(){
				deferred.reject.apply(this, arguments);
			});
		} else {
			//user is just clearing the url, no need for web service calls
			deferred.resolve();
		}
		self.model.set('invalidDataSourceUrl', true);
		self.model.get('dataSourceVariables').reset();
		self.resetDates();
		this.render();
		return deferred.promise();
	},
	'failedToParseVariableResponseMessage' : "No variables were discovered at this data source url.",
	/**
	 * Gets the variables present in a url. 
	 * 
	 * @param {String} dataSourceUrl
	 * @returns {jQuery.Deferred.promise} The promise is resolved with args 
	 * ({String} data source url, {String} variable name) when the web service call 
	 * succeeds. The promise is rejected with one arg ({String} error message) 
	 * if the web service calls fail or their responses cannot be parsed.
	 */
	'getGrids': function (dataSourceUrl) {
		var self = this,
				variables,
				deferred = $.Deferred(),
				wpsInputs = {
					"catalog-url": [dataSourceUrl],
					"allow-cached-response": ["true"]
				},
		wpsOutput = ["result_as_json"];

		this.wps.sendWpsExecuteRequest(
				this.wpsEndpoint + '/WebProcessingService',
				VARIABLE_WPS_PROCESS_ID,
				wpsInputs,
				wpsOutput,
				false,
				null,
				true,
				'json',
				'application/json'
				).done(function (response, textStatus, message) {
			var invalid = true;
			if (response.datatypecollection && response.datatypecollection.types && response.datatypecollection.types.length > 0) {
				variables = _.map(response.datatypecollection.types, function (type) {
					var text = type.name + ' - ' + type.description + ' (' + type.unitsstring + ")";
					var value = type.name;
					return {
						'text': text,
						'value': value,
						'selected': false
					};
				});
				invalid = false;
				deferred.resolve(dataSourceUrl, variables[0].value);
			}
			else {
				//todo: anything better than 'alert'
				var message = self.failedToParseVariableResponseMessage;
				alert(message);
				deferred.reject(message);
			}
			self.model.get('dataSourceVariables').reset(variables);
			self.model.set('invalidDataSourceUrl', invalid);
		}).fail(function (jqxhr, textStatus, message) {
			//todo: anything better than 'alert'
			alert(message);
			self.model.set('invalidDataSourceUrl', true);
			self.model.get('dataSourceVariables').reset();
			deferred.reject(message);
		}).always(function () {
			self.render();
		});
		return deferred.promise();
	},
	'hasExpectedNumericProperties' : function(obj, expectedProperties){
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
	},
	'isValidDateRangeResponse' : function(response){
		var expectedProperties = ['year','month','day'],
		hasAvailableTimes = false,
		validStartTime = false,
		validEndTime = false,
		isDefined = !!response;
		if(isDefined){
			hasAvailableTimes = !!response.availabletimes;
			if(hasAvailableTimes){
				validStartTime = this.hasExpectedNumericProperties(response.availabletimes.starttime, expectedProperties),
				validEndTime = this.hasExpectedNumericProperties(response.availabletimes.endtime, expectedProperties);
			}
		}
		return isDefined && hasAvailableTimes && validStartTime && validEndTime;
	},
	'failedToParseDateRangeResponseMessage' : 'Could not determine date range for selected data source',
	/**
	 * Retrieves the date range for a given data source and variable. Updates
	 * the model with the retrieved values.
	 * 
	 * @param {String} dataSourceUrl
	 * @param {String} variableName
	 * @returns {jQuery.Deferred.promise} The promise is resolved with no args
	 * when the web service call completes successfully. The promise is rejected
	 * with an error message if the web service calls fail or the responses
	 * cannot be parsed.
	 */
	'getDateRange': function(dataSourceUrl, variableName){
		var self = this,
			deferred = $.Deferred(),
			wpsInputs = {
				"catalog-url": [dataSourceUrl],
				"allow-cached-response": ["true"],
				"grid": [variableName]
			},
			wpsOutput = ["result_as_json"];
		
		this.wps.sendWpsExecuteRequest(
			this.wpsEndpoint + '/WebProcessingService',
			DATE_RANGE_WPS_PROCESS_ID,
			wpsInputs,
			wpsOutput,
			false,
			null,
			true,
			'json',
			'application/json'
		).done(function (response, textStatus, message) {
			var minDate,
				maxDate,
				invalid = true;
			if (self.isValidDateRangeResponse(response)){
				var minObj = response.availabletimes.starttime,
					maxObj = response.availabletimes.endtime;
				//service month index is 1-based. JS month index is 0-based
				minDate = new Date(minObj.year, minObj.month - 1, minObj.day);
				maxDate = new Date(maxObj.year, maxObj.month -1, maxObj.day);
				invalid = false;
			}
			else {
				//todo: anything better than 'alert'
				var message = self.failedToParseDateRangeResponseMessage;
				alert(message);
				deferred.reject(message);
			}
			self.model.set('minDate', minDate);
			self.model.set('startDate', minDate);
			self.model.set('maxDate', maxDate);
			self.model.set('endDate', maxDate);
			self.model.set('invalidDataSourceUrl', invalid);
			deferred.resolve();
		}).fail(function (jqxhr, textStatus, message) {
			//todo: anything better than 'alert'
			alert(message);
			self.model.set('minDate', null);
			self.model.set('maxDate', null);
			self.model.set('invalidDataSourceUrl', true);
			deferred.reject(message);
		}).always(function () {
			self.render();
		});
		return deferred.promise();
	},
	'changeEndDate': function(event){
		var newEndDate = event.date;
		this.model.set('endDate', newEndDate);
		var startDatePicker = $(datePickers.start.selector).datepicker();
		if(newEndDate){
			startDatePicker.datepicker('setEndDate', newEndDate);
		}else{
			var maxDate = this.model.get('maxDate');
			startDatePicker.datepicker('setEndDate', maxDate);
		}
	},
	'changeStartDate': function(event){
		var newStartDate = event.date;
		this.model.set('startDate', newStartDate);
		
		var endDatePicker = $(datePickers.end.selector).datepicker();
		if(newStartDate){
			endDatePicker.datepicker('setStartDate', newStartDate);
		}else{
			var minDate = this.model.get('minDate');
			endDatePicker.datepicker('setStartDate', minDate);
		}
	}
});

GDP.ADVANCED.view.DataDetailsView.VARIABLE_WPS_PROCESS_ID = VARIABLE_WPS_PROCESS_ID;
GDP.ADVANCED.view.DataDetailsView.DATE_RANGE_WPS_PROCESS_ID = DATE_RANGE_WPS_PROCESS_ID;

}(_, jQuery));