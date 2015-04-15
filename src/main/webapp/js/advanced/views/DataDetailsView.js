/*jslint browser: true*/
/*global _ jQuery*/
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
    var changeUrl = function(ev){
	var value = ev.target.value;

	var variables = [];
	
	//todo: url validation
	
	if(!(_.isNull(value) || _.isUndefined(value) || _.isEmpty(value))){
	    //todo: launch ajax call to retrieve variables
	    variables = [
		{'text': 'dummy1', 'value': 'dummy1', 'selected': false},
		{'text': 'dummy2', 'value': 'dummy2', 'selected': false},
		{'text': 'dummy3', 'value': 'dummy3', 'selected': false}
	    ];
	}
	this.model.set('dataSourceUrl', value);
	this.model.get('dataSourceVariables').reset(variables);
	this.render();
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
	initialize: function() {

	    //super
	    GDP.util.BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
	    this.$el.html(this.template({
		url : this.model.get('dataSourceUrl'),
		variables : this.model.get('dataSourceVariables')
	    }));
		
	    datePickers.start.$el = $(datePickers.start.selector);
	    datePickers.end.$el = $(datePickers.end.selector);
	    urlPicker.$el = $(urlPicker.selector);
	    
	    datePickers.start.$el.datepicker();
	    datePickers.end.$el.datepicker();
	    return this;
	},
	selectVariables: selectVariables,
	changeUrl: changeUrl
    });

GDP.ADVANCED.view.DataDetailsView.VARIABLE_WPS_PROCESS_ID = VARIABLE_WPS_PROCESS_ID;
GDP.ADVANCED.view.DataDetailsView.DATE_RANGE_WPS_PROCESS_ID = DATE_RANGE_WPS_PROCESS_ID;

}(_, jQuery));

