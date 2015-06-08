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

	GDP.PROCESS_CLIENT.templates = GDP.util.templateLoader(GDP.BASE_URL + 'js/process_client/templates/');

	var loadConfigModel = $.when($.ajax(GDP.BASE_URL + 'config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
				var applicationConfig = GDP.config.get('application');
				initializeLogging({
					LOG4JS_LOG_THRESHOLD: applicationConfig.development === 'true' ? 'debug' : 'info'
				});
				GDP.cswClient = new GDP.OGC.CSW({
					url : applicationConfig.endpoints.csw
				});
			},
			error : function (jqXHR, textStatus) {
				console.log('Can not read config ' + textStatus);
			}
		}));

	// I need to load up my config model since one of the views I load depends on it
	// Load up the process collection based on incoming model definitions from the config object

	var loadTemplates = GDP.PROCESS_CLIENT.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.PROCESS_CLIENT.templates.registerPartials(PARTIALS);

	var loadAlgorithms = $.ajax(GDP.BASE_URL + 'algorithms', {
		success : function(data) {
			GDP.algorithms = new Backbone.Model($.parseJSON(data));
		},
		error : function(jqXHR, textStatus) {
			console.log('Can\'t load algorithms ' + textStatus);
		}
	});

	$.when(loadTemplates, loadPartials, loadConfigModel, loadAlgorithms).always(function () {
		GDP.PROCESS_CLIENT.templates.registerHelpers();
		GDP.logger = log4javascript.getLogger();

		var jobModel = new GDP.PROCESS_CLIENT.model.Job();
		jobModel.get('processes').reset(GDP.config.get('process').processes);

		var wps = GDP.OGC.WPS(GDP.logger);
		GDP.PROCESS_CLIENT.router = new GDP.PROCESS_CLIENT.controller.ProcessClientRouter(jobModel, wps);
		Backbone.history.start({pushState : true, root: '/gdp_web/client/'});
	});

});
