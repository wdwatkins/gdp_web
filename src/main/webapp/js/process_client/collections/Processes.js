/*jslint browser: true*/
/*global Backbone*/
/*global _*/
var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

GDP.PROCESS_CLIENT.collection = GDP.PROCESS_CLIENT.collection || {};

GDP.PROCESS_CLIENT.collection.Processes = Backbone.Collection.extend({
	model: GDP.PROCESS_CLIENT.model.Process
});