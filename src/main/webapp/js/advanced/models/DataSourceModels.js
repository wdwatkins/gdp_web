/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};
(function(){
    "use strict";
    GDP.ADVANCED = GDP.ADVANCED || {};

    GDP.ADVANCED.model = GDP.ADVANCED.model || {};

    var DataSourceVariable = Backbone.Model.extend({
	defaults:{
	    text: '',
	    value: null,
	    selected: false
	}
    });
    
    var DataSourceVariables = Backbone.Collection.extend({
	model: DataSourceVariable
    });
    
    GDP.ADVANCED.model.DataSourceVariable = DataSourceVariable;
    GDP.ADVANCED.model.DataSourceVariables = DataSourceVariables;
}());