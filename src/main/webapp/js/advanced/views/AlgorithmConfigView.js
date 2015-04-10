/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.AlgorithmConfigView = GDP.util.BaseView.extend({
	render : function () {
		"use strict";
		this.$el.html(this.template(this.collection.models));
		return this;
	}
});