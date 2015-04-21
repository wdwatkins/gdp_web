/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.AlgorithmConfigView = GDP.util.BaseView.extend({

	initialize : function(options) {
		this.$el = $(options.el);

		GDP.util.BaseView.prototype.initialize.apply(this, arguments);
		this.processModelsCollection = this.model.get('processes');
	},

	render : function () {
		"use strict";
		if (!this.processModelsCollection) {
			return false;
		}

		var algorithm = this.model.get('processes').findWhere({'id' : this.model.get('algorithmId')});

		this.$el.html(this.template({
			"job" : this.model.attributes,
			"inputs" : algorithm.get('inputs')
		}));
		return this;
	}
});