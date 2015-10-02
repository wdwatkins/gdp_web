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
				cache : false,
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
			},
			'ifAlgorithmDataTypeIsString' : function (type, options) {
				if (type === 'string') {
					return options.fn(this);
				}
				return options.inverse(this);
			},
			'ifBoolean' : function(obj, options) {
				if (obj === 'true' || obj === 'false') {
					return options.fn(this);
				}
				else {
					return options.inverse(this);
				}
			},
			'ifNotBoolean' : function(obj, options) {
				if (obj === 'true' || obj === 'false') {
					return options.inverse(this);
				}
				else {
					return options.fn(this);
				}
			},
			'defaultChecked' : function (boolStr) {
				if (boolStr === 'true') {
					return 'checked="checked"';
				}
				return '';
			},
			'defaultSelected' : function (curr, def) {
				if (curr === def) {
					return 'selected="selected"';
				}
				return '';
			},
			'isMultiple' : function (maxOccurs) {
				if (maxOccurs !== '1') {
					return 'multiple="multiple"';
				}
				return '';
			},
			'isRequired' : function(minOccurs) {
				if (minOccurs > 0) {
					return 'required'
				}
				return '';
			},
			'selectedVariables' : function(variables) {
				var selectedVars = _.filter(variables, function(value) {
					return value.attributes.selected;
				});
				return selectedVars.length;

			},
			'variableTitle' : function(identifier, process) {
				if (process) {
					return _.find(process.inputs, function(v) {
						return v.identifier === identifier;
					}).title;
				}
				else {
					return '';
				}
			},
			'formatProcessText' : function(obj) {
				if (obj) {
					if (_.isArray(obj)) {
						return obj.join(', ');
					}
					if (_.isString(obj)) {
						return obj;
					}
				}
				else {
					return '';
				}
			},
			'truncate' : function(str, length) {
				if (str.length > length) {
					return str.substr(0, length) + '...';
				}
				else {
					return str;
				}
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



