/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};
(function(){
    "use strict";
    GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

    GDP.PROCESS_CLIENT.model = GDP.PROCESS_CLIENT.model || {};

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

    GDP.PROCESS_CLIENT.model.DataSourceVariable = DataSourceVariable;
    GDP.PROCESS_CLIENT.model.DataSourceVariables = DataSourceVariables;
}());