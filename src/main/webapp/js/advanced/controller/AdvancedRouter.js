/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.controller = GDP.ADVANCED.controller || {};

GDP.ADVANCED.controller.AdvancedRouter = Backbone.Router.extend({

	applicationContextDiv : '#advanced-page-content',

	routes : {
		'' : 'hub',
		'spatial' : 'spatial',
		'datadetail' : 'datadetail',
		'process' : 'process'
	},

	hub : function() {
		this.showView(GDP.view.HubView, {
			template : GDP.ADVANCED.templates.getTemplate('hub')
		});
	},

	spatial : function() {
		this.showView(GDP.view.SpatialView, {
			template : GDP.ADVANCED.templates.getTemplate('spatial'),
			model : new GDP.ADVANCED.model.SpatialModel()
		});
	},

	datadetail : function() {
		this.showView(GDP.view.DataDetailsView, {
			template : GDP.ADVANCED.templates.getTemplate('datadetail')
		});
	},

	process : function() {
		this.showView(GDP.view.ProcessView, {
			template : GDP.ADVANCED.templates.getTemplate('process'),
			collection : GDP.processes
		});
	},

	showView : function(view, opts) {
		var newEl = $('<div>');

		this.removeCurrentView();
		$(this.applicationContextDiv).append(newEl);
		this.currentView = new view($.extend({
			el: newEl,
			router: this
		}, opts));
	},

	removeCurrentView : function() {
		if (this.currentView) {
			this.currentView.remove();
		}
	}
});
