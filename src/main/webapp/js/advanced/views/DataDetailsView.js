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
    GDP.view.DataDetailsView = GDP.util.BaseView.extend({
	events: {
	    
	},
	initialize: function() {

	    //super
	    GDP.util.BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
	    this.$el.html(this.template());
		
	    datePickers.start.$el = $(datePickers.start.selector);
	    datePickers.end.$el = $(datePickers.end.selector);
	    
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
	    
	    return this;
	}
    });

}(_, jQuery));

