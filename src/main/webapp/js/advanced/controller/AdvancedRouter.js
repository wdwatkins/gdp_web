/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.controller = GDP.ADVANCED.controller || {};

GDP.ADVANCED.controller.AdvancedRouter = Backbone.Router.extend({

	applicationContextDiv : '#advanced-page-content',
	jobModel: null,
	initialize: function(jobModel){
	  this.jobModel = jobModel;
	},
	routes : {
		'' : 'hub',
		'spatial' : 'spatial',
		'datadetail' : 'datadetail',
		'process' : 'process'
	},

	hub : function() {
		this.showView(GDP.ADVANCED.view.HubView, {
			template : GDP.ADVANCED.templates.getTemplate('hub'),
			model: this.jobModel
		});
	},

	spatial : function() {
		this.showView(GDP.ADVANCED.view.SpatialView, {
			template : GDP.ADVANCED.templates.getTemplate('spatial'),
			model : this.jobModel
		});
	},

	datadetail : function() {
		this.showView(GDP.ADVANCED.view.DataDetailsView, {
			template : GDP.ADVANCED.templates.getTemplate('datadetail'),
			model: this.jobModel,
			wps: GDP.OGC.WPS(GDP.logger),
			wpsEndpoint: GDP.config.get('application').endpoints.utilityWps
		});
	},

	process : function() {
		this.showView(GDP.ADVANCED.view.ProcessView, {
			template : GDP.ADVANCED.templates.getTemplate('process'),
			algorithmTemplate : GDP.ADVANCED.templates.getTemplate('algorithm-config'),
			model: this.jobModel
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
