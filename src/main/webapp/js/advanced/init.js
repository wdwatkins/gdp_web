/*jslint browser: true*/
/*global Backbone*/
/*global _*/
/*global log4javascript*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

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

	GDP.ADVANCED.templates = GDP.util.templateLoader('js/advanced/templates/');
	
	var loadConfigModel = $.when($.ajax('config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
			}
		}));
	
	// I need to load up my config model since one of the views I load depends on it
	// Load up the process collection based on incoming model definitions from the config object

	var loadTemplates = GDP.ADVANCED.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.ADVANCED.templates.registerPartials(PARTIALS);

	$.when(loadTemplates, loadPartials, loadConfigModel).always(function () {
		initializeLogging({
			LOG4JS_LOG_THRESHOLD: GDP.config.get('application').development === 'true' ? 'debug' : 'info'
		});
		
		GDP.ADVANCED.templates.registerHelpers();
		GDP.logger = log4javascript.getLogger();
		var jobModel = new GDP.ADVANCED.model.Job();
		jobModel.get('processes').reset(GDP.config.get('process').processes);
		GDP.ADVANCED.router = new GDP.ADVANCED.controller.AdvancedRouter(jobModel);
		Backbone.history.start();
	});

});
