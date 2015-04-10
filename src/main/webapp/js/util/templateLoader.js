/*jslint browser: true*/
/*global Handlebars*/
/*global _*/
var GDP = GDP || {};

GDP.util = GDP.util || {};

GDP.util.templateLoader = function(templateDir) {

	var self = {};

	var templates = {};

	self.getTemplate = function(name) {
		if (_.has(templates, name)) {
			return templates[name];
		}
		else {
			return null;
		}
	};

	self.loadTemplates = function(names) {
		var i;
		var loadingDeferreds = [];
		for (i = 0; i < names.length; i++) {
			templates[names[i]] = '';
			loadingDeferreds.push($.ajax({
				url : templateDir + names[i] + '.html',
				success : function(data) {
					templates[this] = Handlebars.compile(data);
				},
				error : function() {
					templates[this] = Handlebars.compile('Unable to load template');
				},
				context : names[i]
			}));
		}
		
		return $.when.apply(null, loadingDeferreds);
	};
	
	self.registerHelpers = function () {
		Handlebars.registerHelper({
			'ifAlgorithmInputTypeIsLiteral' : function (type, options) {
				if (type === 'literal') {	
					return options.fn(this);
				}
				return options.inverse(this);
			},
			'ifAlgorithmInputTypeIsComplex' : function (type, options) {
				if (type === 'complex') {
					return options.fn(this);
				}
				return options.inverse(this);
			},
			'ifAlgorithmDataTypeIsBoolean' : function (type, options) {
				if (type === 'boolean') {
					return options.fn(this);
				}
				return options.inverse(this);
			}
		});
	};

	self.registerPartials = function(names) {
		var i;
		var loadingDeferreds = [];
		for (i = 0; i < names.length; i++) {
			loadingDeferreds.push($.ajax({
				url : templateDir + 'partials/' + names[i] + '.html',
				success : function(data) {
					Handlebars.registerPartial(this, data);
				},
				error : function() {
					Handlebars.registerPartial(this, 'Can\'t retrieve partial template');
				},
				context : names[i]
			}));
		}
		return $.when.apply(null, loadingDeferreds);
	};

	return self;
};



