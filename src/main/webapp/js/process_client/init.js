/*jslint browser: true*/
/*global Backbone*/
/*global _*/
/*global log4javascript*/
var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

$(document).ready(function() {
	"use strict";

	// Preload all templates and partials
	var TEMPLATES = [
		'hub',
		'spatial',
		'datadetail',
		'process',
		'algorithm-config'
	];

	var PARTIALS = [];

	GDP.PROCESS_CLIENT.templates = GDP.util.templateLoader('js/process_client/templates/');

	var loadConfigModel = $.when($.ajax('config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
			},
			error : function (jqXHR, textStatus) {
				console.log('Can not read config ' + textStatus);
			}
		}));

	// I need to load up my config model since one of the views I load depends on it
	// Load up the process collection based on incoming model definitions from the config object

	var loadTemplates = GDP.PROCESS_CLIENT.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.PROCESS_CLIENT.templates.registerPartials(PARTIALS);

	$.when(loadTemplates, loadPartials, loadConfigModel).always(function () {
		initializeLogging({
			LOG4JS_LOG_THRESHOLD: GDP.config.get('application').development === 'true' ? 'debug' : 'info'
		});

		GDP.PROCESS_CLIENT.templates.registerHelpers();
		GDP.logger = log4javascript.getLogger();

		var jobModel = new GDP.PROCESS_CLIENT.model.Job();
		jobModel.get('processes').reset(GDP.config.get('process').processes);

		var wps = GDP.OGC.WPS(GDP.logger);
		GDP.PROCESS_CLIENT.router = new GDP.PROCESS_CLIENT.controller.AdvancedRouter(jobModel, wps);
		Backbone.history.start();
	});

});
