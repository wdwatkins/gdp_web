/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

GDP.PROCESS_CLIENT.controller = GDP.PROCESS_CLIENT.controller || {};

GDP.PROCESS_CLIENT.controller.AdvancedRouter = Backbone.Router.extend({

	applicationContextDiv : '#advanced-page-content',
	jobModel: null,
	initialize: function(jobModel, wps){
	  this.jobModel = jobModel;
	  this.wps = wps;
	},
	routes : {
		'' : 'hub',
		'spatial' : 'spatial',
		'datadetail' : 'datadetail',
		'process' : 'process'
	},

	hub : function() {
		this.showView(GDP.PROCESS_CLIENT.view.HubView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('hub'),
			model: this.jobModel,
			wps : this.wps
		});
	},

	spatial : function() {
		this.showView(GDP.PROCESS_CLIENT.view.SpatialView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('spatial'),
			model : this.jobModel,
			wps : this.wps
		});
	},

	datadetail : function() {
		this.showView(GDP.PROCESS_CLIENT.view.DataDetailsView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('datadetail'),
			model: this.jobModel,
			wps: this.wps,
			wpsEndpoint: GDP.config.get('application').endpoints.utilityWps
		});
	},

	process : function() {
		this.showView(GDP.PROCESS_CLIENT.view.ProcessView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('process'),
			algorithmTemplate : GDP.PROCESS_CLIENT.templates.getTemplate('algorithm-config'),
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
