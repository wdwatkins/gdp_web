/*jslint browser: true*/
/*global log4javascript*/
/*global $*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

$(document).ready(function() {
	"use strict";

	var TEMPLATES = [
		'datasource_select',
		'data_set_tile',
		'data_set_details',
		'welcome'
	];

	initializeLogging({
		LOG4JS_LOG_THRESHOLD: GDP.DEVELOPMENT === 'true' ? 'debug' : 'info'
	});
	GDP.logger = log4javascript.getLogger();

	GDP.LANDING.templates = GDP.util.templateLoader('templates/');
	var loadConfigModel = $.ajax('config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
				var applicationConfig = GDP.config.get('application');

				GDP.cswClient = new GDP.OGC.CSW({
					url : applicationConfig.endpoints.csw
				});
			},
			error : function (jqXHR, textStatus) {
				GDP.logger.error('Can not read config ' + textStatus);
			}
		});

	var loadAlgorithms = $.ajax('algorithms', {
		success : function(data) {
			GDP.algorithms = new Backbone.Model($.parseJSON(data));
		},
		error : function(jqXHR, textStatus) {
			GDP.logger.error('Can\'t load algorithms ' + textStatus);
		}
	});

	var loadTemplates = GDP.LANDING.templates.loadTemplates(TEMPLATES);

	$.when(loadTemplates, loadConfigModel, loadAlgorithms).always(function () {
		GDP.LANDING.templates.registerHelpers();

		var dataSets = new GDP.models.DataSetCollection();
		GDP.LANDING.router = new GDP.LANDING.controller.LandingRouter({
			dataSets : dataSets
		});
		Backbone.history.start();
	});
});


