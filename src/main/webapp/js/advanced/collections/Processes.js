/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.collection = GDP.ADVANCED.collection || {};

GDP.ADVANCED.collection.Processes = Backbone.Collection.extend({
	model: GDP.ADVANCED.model.Process
});