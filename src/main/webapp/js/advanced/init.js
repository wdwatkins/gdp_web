var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

$(document).ready(function() {
	// Preload all templates and partials
	var TEMPLATES = [];

	var PARTIALS = [];

	GDP.ADVANCED.templates = GDP.util.templateLoader();
	var loadTemplates = GDP.ADVANCED.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.ADVANCED.templates.registerPartials(PARTIALS);
	$.when(loadTemplates, loadPartials).always(function() {
		GDP.ADVANCED.router = new GDP.ADVANCED.controller.AdvancedRouter();
		Backbone.history.start();
	});
});
