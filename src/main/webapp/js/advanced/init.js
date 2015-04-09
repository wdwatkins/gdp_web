/*jslint browser: true*/
/*global Backbone*/
/*global _*/
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
	var loadTemplates = GDP.ADVANCED.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.ADVANCED.templates.registerPartials(PARTIALS);
	var loadConfigModel = $.when($.ajax('config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
			}
		}));
	
	$.when(loadTemplates, loadPartials, loadConfigModel).always(function() {
		// Load up the process collection based on incoming model definitions from the config object
		GDP.processes = new GDP.collection.Processes(_.map(GDP.config.get('process').processes, function (m) {
			return new GDP.model.Process(m);
		}));
		GDP.ADVANCED.router = new GDP.ADVANCED.controller.AdvancedRouter();
		Backbone.history.start();
	});
});
