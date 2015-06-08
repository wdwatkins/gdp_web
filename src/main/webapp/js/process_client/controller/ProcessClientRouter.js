/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

GDP.PROCESS_CLIENT.controller = GDP.PROCESS_CLIENT.controller || {};

GDP.PROCESS_CLIENT.controller.ProcessClientRouter = Backbone.Router.extend({

	applicationContextDiv : '#advanced-page-content',
	jobModel: null,
	initialize: function(jobModel, wps){
	  this.jobModel = jobModel;
	  this.wps = wps;
	},
	routes : {
		'advanced/' : 'hub',
		'advanced/spatial' : 'spatial',
		'advanced/datadetail' : 'datadetail',
		'advanced/process' : 'process',

		'catalog/gdp/dataset/:datasetid/' : 'hub',
		'catalog/gdp/dataset/:datasetid/spatial' : 'spatial',
		'catalog/gdp/dataset/:datasetid/datadetail' : 'datadetail',
		'catalog/gdp/dataset/:datasetid/process' : 'process'
	},

	hub : function(datasetid) {
		this.showView(GDP.PROCESS_CLIENT.view.HubView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('hub'),
			model: this.jobModel,
			datasetId : datasetid,
			wps : this.wps
		});
	},

	spatial : function(datasetid) {
		this.showView(GDP.PROCESS_CLIENT.view.SpatialView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('spatial'),
			model : this.jobModel,
			datasetId : datasetid,
			wps : this.wps
		});
	},

	datadetail : function(datasetid) {
		this.showView(GDP.PROCESS_CLIENT.view.DataDetailsView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('datadetail'),
			model: this.jobModel,
			datasetId : datasetid,
			wps: this.wps,
			wpsEndpoint: GDP.config.get('application').endpoints.utilityWps
		});
	},

	process : function(datasetid) {
		this.showView(GDP.PROCESS_CLIENT.view.ProcessView, {
			template : GDP.PROCESS_CLIENT.templates.getTemplate('process'),
			algorithmTemplate : GDP.PROCESS_CLIENT.templates.getTemplate('algorithm-config'),
			model: this.jobModel,
			datasetId : datasetid
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
