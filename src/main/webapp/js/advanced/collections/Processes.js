/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.collection = GDP.collection || {};

GDP.collection.Processes = Backbone.Collection.extend({
	model: GDP.model.Process
});