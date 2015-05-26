/*jsline browser: true*/
/*global log4javascript*/
/*global $*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

$(document).ready(function() {
	"use strict";

	var TEMPLATES = [
		'datasource_select',
		'data_set_tile'
	];

	GDP.LANDING.templates = GDP.util.templateLoader('js/landing/templates/');
	var loadConfigModel = $.when($.ajax('config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
				var applicationConfig = GDP.config.get('application');
				initializeLogging({
					LOG4JS_LOG_THRESHOLD: applicationConfig.development === 'true' ? 'debug' : 'info'
				});
				GDP.logger = log4javascript.getLogger();

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

	var loadTemplates = GDP.LANDING.templates.loadTemplates(TEMPLATES);

	$.when(loadTemplates, loadConfigModel).always(function () {
		GDP.LANDING.templates.registerHelpers();

		var dataSets = new GDP.LANDING.models.DataSetCollection();
		GDP.LANDING.router = new GDP.LANDING.controller.LandingRouter({
			dataSets : dataSets
		});
		Backbone.history.start();
	});
});


