/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.AlgorithmConfigView = Backbone.View.extend({
	render : function () {
		"use strict";
		this.$el.html(this.template(this.collection.models));
		return this;
	}
});