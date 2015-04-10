/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.model = GDP.ADVANCED.model || {};

GDP.ADVANCED.model.DataSourceVariable = Backbone.Model.extend({
    defaults:{
	name: null
    }
});

GDP.ADVANCED.model.DataSourceVariables = Backbone.Collection.extend({
    model: GDP.ADVANCED.model.DataSourceVariable
});

GDP.ADVANCED.model.DataSource = Backbone.Model.extend({
    defaults:{
	startDate: null,
	endDate: null,
	url: null,
	variables: new GDP.ADVANCED.model.DataSourceVariables
    }
});