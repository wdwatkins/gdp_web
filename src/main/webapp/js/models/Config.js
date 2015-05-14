/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.model = GDP.model || {};

GDP.model.Config = Backbone.Model.extend({
	defaults : {
		"application" : {
			"development" : "true"
		}
	}
});