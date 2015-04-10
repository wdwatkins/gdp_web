/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.AlgorithmConfigView = GDP.util.BaseView.extend({
	processModelsCollection : null,
	render : function () {
		"use strict";
		if (!this.processModelsCollection) {
			return false;
		}
		
		debugger;
		
		this.$el.html(this.template({
			"job" : this.model.attributes,
			"algorithm" : this.processModelsCollection.get(this.model.attributes.algorithmId)
		}));
		return this;
	}
});