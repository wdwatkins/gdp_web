/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

GDP.PROCESS_CLIENT.controller = GDP.PROCESS_CLIENT.controller || {};

(function() {
	"use strict";

	var isDatasetId = function(datasetid) {
		var pattern = /^[0-9A-Fa-f]+$/;
		return pattern.test(datasetid);
	};

	GDP.PROCESS_CLIENT.controller.ProcessClientRouter = Backbone.Router.extend({

		applicationContextDiv : '#advanced-page-content',
		jobModel: null,
		initialize: function(jobModel){
		  this.jobModel = jobModel;
		},
		routes : {
			'!notFound' : 'errorPage',
			'!advanced' : 'hub',
			'!advanced/spatial' : 'spatial',
			'!advanced/datadetail' : 'datadetail',
			'!advanced/process' : 'process',
			'!advanced/:whatever' : 'notFound',

			'!catalog/gdp/dataset/:datasetid' : 'hub',
			'!catalog/gdp/dataset/:datasetid/spatial' : 'spatial',
			'!catalog/gdp/dataset/:datasetid/datadetail' : 'datadetail',
			'!catalog/gdp/dataset/:datasetid/process' : 'process',
			'!catalog' : 'notFound',
			'!catalog/(:whatever)' : 'notFound',

			'!:whatever' : 'notFound',
			'!/(:whatever)' : 'notFound'
		},

		hub : function(datasetid) {
			if (!datasetid || isDatasetId(datasetid)) {
				this.showView(GDP.PROCESS_CLIENT.view.HubView, {
					template : GDP.PROCESS_CLIENT.templates.getTemplate('hub'),
					metadataTemplate : GDP.PROCESS_CLIENT.templates.getTemplate('data_set_details'),
					model: this.jobModel,
					datasetId : datasetid
				});
			}
			else {
				this.notFound();
			}
		},

		spatial : function(datasetid) {
			if (!datasetid || isDatasetId(datasetid)) {
				this.showView(GDP.PROCESS_CLIENT.view.SpatialView, {
					template : GDP.PROCESS_CLIENT.templates.getTemplate('spatial'),
					model : this.jobModel,
					datasetId : datasetid
				});
			}
			else {
				this.notFound();
			}
		},

		datadetail : function(datasetid) {
			if (!datasetid || isDatasetId(datasetid)) {
				this.showView(GDP.PROCESS_CLIENT.view.DataDetailsView, {
					template : GDP.PROCESS_CLIENT.templates.getTemplate('datadetail'),
					model: this.jobModel,
					datasetId : datasetid
				});
			}
			else {
				this.notFound();
			}
		},

		process : function(datasetid) {
			if (!datasetid || isDatasetId(datasetid)) {
				this.showView(GDP.PROCESS_CLIENT.view.ProcessView, {
					template : GDP.PROCESS_CLIENT.templates.getTemplate('process'),
					algorithmTemplate : GDP.PROCESS_CLIENT.templates.getTemplate('algorithm-config'),
					model: this.jobModel,
					datasetId : datasetid
				});
			}
			else {
				this.notFound();
			}
		},

		notFound : function() {
			this.navigate('#!notFound', {trigger : true, replace : 'true' });
		},

		errorPage : function() {
			this.showView(GDP.PROCESS_CLIENT.view.ErrorView, {
				template : GDP.PROCESS_CLIENT.templates.getTemplate('not_found')
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
}());
