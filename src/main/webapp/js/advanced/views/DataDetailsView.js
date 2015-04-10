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
	//todo: validation
	this.model.set('url', value);
    };
    GDP.view.DataDetailsView = GDP.util.BaseView.extend({
	model: GDP.ADVANCED.model.dataSource,
	events : (function(){
	    var ret = {};
	    ret['change ' + urlPicker.selector] = urlChanged;
	    return ret;
	}()),
	initialize: function() {

	    //super
	    GDP.util.BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
	    this.$el.html(this.template());
		
	    datePickers.start.$el = $(datePickers.start.selector);
	    datePickers.end.$el = $(datePickers.end.selector);
	    urlPicker.$el = $(urlPicker.selector);
	    var disabled;
	    
	    //disable the datepickers unless they already have values
	    datePickers.start.$el.datepicker();
	    disabled = !this.model.get('startDate');
	    datePickers.start.$el.prop('disabled', disabled);
	    
	    datePickers.end.$el.datepicker();
	    disabled = !this.model.get('endDate');
	    datePickers.end.$el.prop('disabled', disabled);
		
	    //disable the variable selection unless the url already has a value
	    var url = this.model.get('url');
	    disabled = _.isNull(url) || _.isUndefined(url);
	    variablePicker.$el = $(variablePicker.selector);
	    variablePicker.$el.prop('disabled', disabled);
	    if(!disabled){
		urlPicker.$el.val(url);
	    }
	    return this;
	}
    });

}(_, jQuery));

