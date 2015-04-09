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
		'process'
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
			LOG4JS_LOG_THRESHOLD: GDP.config.application.development === 'true' ? 'debug' : 'info'
		});
		GDP.logger = log4javascript.getLogger();
		GDP.processes = new GDP.ADVANCED.collection.Processes(_.map(GDP.config.get('process').processes, function (m) {
			return new GDP.ADVANCED.model.Process(m);
		}));
		GDP.ADVANCED.router = new GDP.ADVANCED.controller.AdvancedRouter();
		Backbone.history.start();
	});

});
