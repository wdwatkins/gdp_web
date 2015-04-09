/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.model = GDP.model || {};

GDP.model.DataSourceVariable = Backbone.Model.extend({
    defaults:{
	name: null
    }
});

GDP.model.DataSourceVariables = Backbone.Collection.extend({
    model: GDP.model.DataSourceVariable,
    initialize: function(models, options){
	this.bind("add", options.view.dataSourceVariableAdd);
    }
});

GDP.model.DataSource = Backbone.Model.extend({
    defaults:{
	startDate: null,
	endDate: null,
	url: null,
	variables: new GDP.model.DataSourceVariables
    }
});