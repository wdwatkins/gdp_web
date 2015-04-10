/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};
(function(){
    "use strict";
    GDP.ADVANCED = GDP.ADVANCED || {};

    GDP.ADVANCED.model = GDP.ADVANCED.model || {};

    var DataSourceVariable = Backbone.Model.extend({
	defaults:{
	    name: null
	}
    });
    
    var DataSourceVariables = Backbone.Collection.extend({
	model: DataSourceVariable
    });
    var theDataSourceVariables = new DataSourceVariables();
    
    var DataSource = Backbone.Model.extend({
	defaults:{
	    startDate: null,
	    endDate: null,
	    url: null,
	    variables: theDataSourceVariables
	}
    });
    GDP.ADVANCED.model.dataSource = new DataSource();

}());