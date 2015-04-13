/*jslint browser: true*/
/*global _ jQuery*/
var GDP = GDP || {};
(function(_, $){
    "use strict";

    GDP.view = GDP.view || {};
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
    var urlChanged = function(ev){
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
	this.model.set('url', value);
	this.model.get('variables').reset(variables);
	this.render();
    };
    var variableSelected = function(ev){
	
	var variables = _.map(ev.target.options, function(option){
	    return {
		text: option.text,
		value: option.value,
		selected: option.selected
	    };
	});
	
	this.model.get('variables').reset(variables);
	this.render();
    };
    
    GDP.view.DataDetailsView = GDP.util.BaseView.extend({
	events : (function(){
	    var ret = {};
	    ret['change ' + variablePicker.selector] = variableSelected;
	    ret['change ' + urlPicker.selector] = urlChanged;
	    return ret;
	}()),
	initialize: function() {

	    //super
	    GDP.util.BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
	    this.$el.html(this.template(this.model.attributes));
		
	    datePickers.start.$el = $(datePickers.start.selector);
	    datePickers.end.$el = $(datePickers.end.selector);
	    urlPicker.$el = $(urlPicker.selector);
	    
	    datePickers.start.$el.datepicker();
	    datePickers.end.$el.datepicker();
	    return this;
	}
    });

}(_, jQuery));

