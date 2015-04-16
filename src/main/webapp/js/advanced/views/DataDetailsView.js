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
	
	var getDateRange = function(catalogUrl, gridName){
		var self = this,
			wpsInputs = {
				"catalog-url": [catalogUrl],
				"allow-cached-response": ["true"],
				"grid": [gridName]
			},
			wpsOutput = ["result_as_json"];
		//todo: url validation
		
		//delete current settings
		_.each(['minDate', 'startDate', 'maxDate', 'endDate'], function(dateProp){
			self.model.set(dateProp, null);
		});
		
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
			if (response.availabletimes && response.availabletimes.time && 2 === response.availabletimes.time.length) {
				var minObj = response.availabletimes.starttime;
				
				//service month index is 1-based. JS month index is 0-based
				minDate = new Date(minObj.year, minObj.month - 1, minObj.day);
				var maxObj = response.availabletimes.endtime;
				maxDate = new Date(maxObj.year, maxObj.month -1, maxObj.day);
				invalid = false;
			}
			else {
				//todo: anything better than 'alert'
				alert("Could not determine date range for selected data source");
			}
			self.model.set('minDate', minDate);
			self.model.set('startDate', minDate);
			self.model.set('maxDate', maxDate);
			self.model.set('endDate', maxDate);
			self.model.set('invalidDataSourceUrl', invalid);
		}).fail(function (jqxhr, textStatus, message) {
			//todo: anything better than 'alert'
			alert(message);
			self.model.set('minDate', null);
			self.model.set('maxDate', null);
			self.model.set('invalidDataSourceUrl', true);
		}).always(function () {
			self.render();
		});
	};
	var getGrids = function (catalogUrl) {
		var self = this,
				wpsInputs = {
					"catalog-url": [catalogUrl],
					"allow-cached-response": ["true"]
				},
		wpsOutput = ["result_as_json"];
		//todo: url validation

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
			var variables,
					invalid = true;
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
				self.getDateRange(catalogUrl, variables[0].value);
			}
			else {
				//todo: anything better than 'alert'
				alert("No variables were discovered at this data source url.");
			}
			self.model.get('dataSourceVariables').reset(variables);
			self.model.set('invalidDataSourceUrl', invalid);
		}).fail(function (jqxhr, textStatus, message) {
			//todo: anything better than 'alert'
			alert(message);
			self.model.set('invalidDataSourceUrl', true);
			self.model.get('dataSourceVariables').reset();
		}).always(function () {
			self.render();
		});
	};
	var changeUrl = function (ev) {
		var self = this;
		var value = ev.target.value;
		this.model.set('dataSourceUrl', value);
		if (!(_.isNull(value) || _.isUndefined(value) || _.isEmpty(value))) {
			this.getGrids(value);
		}else{
			self.model.set('invalidDataSourceUrl', true);
			self.model.get('dataSourceVariables').reset();
			this.render();
		}
	};
    var selectVariables = function(ev){
	
	var variables = _.map(ev.target.options, function(option){
	    return {
		text: option.text,
		value: option.value,
		selected: option.selected
	    };
	});
	
	this.model.get('dataSourceVariables').reset(variables);
	this.render();
    };
    
	var VARIABLE_WPS_PROCESS_ID = 'gov.usgs.cida.gdp.wps.algorithm.discovery.ListOpendapGrids';
	var DATE_RANGE_WPS_PROCESS_ID = 'gov.usgs.cida.gdp.wps.algorithm.discovery.GetGridTimeRange';
    
    GDP.ADVANCED.view.DataDetailsView = GDP.util.BaseView.extend({
	events : (function(){
	    var ret = {};
	    ret['change ' + variablePicker.selector] = selectVariables;
	    ret['change ' + urlPicker.selector] = changeUrl;
	    return ret;
	}()),
	wps : null,
	initialize: function(options) {
	    this.wps = options.wps;
	    this.wpsEndpoint = options.wpsEndpoint;
	    //super
	    GDP.util.BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
	    this.$el.html(this.template({
		url : this.model.get('dataSourceUrl'),
		variables : this.model.get('dataSourceVariables'),
		invalidUrl : this.model.get('invalidDataSourceUrl'),
		minDate : this.model.get('minDate'),
		maxDate : this.model.get('maxDate')
	    }));
		
	    datePickers.start.$el = $(datePickers.start.selector);
	    datePickers.end.$el = $(datePickers.end.selector);
	    urlPicker.$el = $(urlPicker.selector);
		variablePicker.$el = $(variablePicker.selector);
		
		var startDate = this.model.get('startDate');
		var endDate = this.model.get('endDate');
		var startDatePicker = datePickers.start.$el.datepicker();
		startDatePicker.datepicker('setDate', startDate);
		var endDatePicker = datePickers.end.$el.datepicker();
		endDatePicker.datepicker('setDate', endDate);
		return this;
	},
	selectVariables: selectVariables,
	changeUrl: changeUrl,
	getGrids: getGrids,
	getDateRange: getDateRange
    });

GDP.ADVANCED.view.DataDetailsView.VARIABLE_WPS_PROCESS_ID = VARIABLE_WPS_PROCESS_ID;
GDP.ADVANCED.view.DataDetailsView.DATE_RANGE_WPS_PROCESS_ID = DATE_RANGE_WPS_PROCESS_ID;

}(_, jQuery));

