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
		'algorithm-config',
		'data_set_details',
		'welcome',
		'not_found',
	];

	var PARTIALS = [];

	initializeLogging({
		LOG4JS_LOG_THRESHOLD: GDP.DEVELOPMENT === 'true' ? 'debug' : 'info'
	});
	GDP.logger = log4javascript.getLogger();

	GDP.PROCESS_CLIENT.templates = GDP.util.templateLoader(GDP.BASE_URL + 'templates/');

	var loadConfigModel = $.ajax(GDP.BASE_URL + 'config', {
		success: function (data) {
			GDP.config = new GDP.model.Config(data);
			var applicationConfig = GDP.config.get('application');

			var application = GDP.config.get('application');
			// Need to override the endpoints for services if they are in the incoming POST parameters
			if (_.has(GDP.incomingParams, 'feature_wms')) {
				application.endpoints.wms = GDP.incomingParams.feature_wms;
			}
			if (_.has(GDP.incomingParams, 'feature_wfs')) {
				application.endpoints.wfs = GDP.incomingParams.feature_wfs;
				application.serviceEndpoints.wfs = GDP.incomingParams.feature_wfs;
			}
			GDP.config.set({'application' : application});

			GDP.cswClient = new GDP.OGC.CSW({
				url : applicationConfig.endpoints.csw
			});
		},
		error : function (jqXHR, textStatus) {
			GDP.logger.error('Can not read config ' + textStatus);
		}
	});

	var loadTemplates = GDP.PROCESS_CLIENT.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.PROCESS_CLIENT.templates.registerPartials(PARTIALS);

	var loadAlgorithms = $.ajax(GDP.BASE_URL + 'algorithms', {
		success : function(data) {
			GDP.algorithms = new Backbone.Model($.parseJSON(data));
		},
		error : function(jqXHR, textStatus) {
			GDP.logger.error('Can\'t load algorithms ' + textStatus);
		}
	});

	$.when(loadTemplates, loadPartials, loadConfigModel, loadAlgorithms).always(function () {
		GDP.PROCESS_CLIENT.templates.registerHelpers();

		var jobModel = new GDP.PROCESS_CLIENT.model.Job();
		jobModel.get('processes').reset(GDP.config.get('process').processes);

		GDP.wpsClient = GDP.OGC.WPS(GDP.logger);
		GDP.PROCESS_CLIENT.router = new GDP.PROCESS_CLIENT.controller.ProcessClientRouter(jobModel);

		var origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		var root  = GDP.BASE_URL.replace(origin, '');
		var successfulRoute = Backbone.history.start({root: root + 'client/'});
		if (!successfulRoute) {
			GDP.PROCESS_CLIENT.router.errorPage();
		}
	});

});
