/*jslint browser: true*/
/*global Backbone*/
/*global _*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};
GDP.ADVANCED.view = GDP.ADVANCED.view || {};


// Can't wrap this in a function because it is used when defining GDP.ADVANCED.view.ProcessView
GDP.ADVANCED.view.AlgorithmConfigView = GDP.util.BaseView.extend({

	events : {
		'change #process-algorithm-configuration-description input[type="text"]' : 'changeTextProcessVariable',
		'change #process-algorithm-configuration-description input[type="checkbox"]' : 'changeBooleanProcessVariable',
		'change #process-algorithm-configuration-description select' : 'changeSelectProcessVariable',
		'change #email' : 'changeEmail',
		'change #filename' : 'changeFilename'
	},

	/*
	 * @constructor
	 * @param {Object} options
	 *     @prop {Function} template
	 *     @prop {Backbone.model} model,
	 *     @prop {String} el
	 */
	initialize : function(options) {
		"use strict";
		var processVariables;
		var varKeys;

		$(options.el).append('<div id="algorithm-view-container"></div>');
		this.$el = $('#algorithm-view-container');

		GDP.util.BaseView.prototype.initialize.apply(this, arguments);

		// Set up model listeners
		processVariables = this.model.get('processVariables');
		this.listenTo(processVariables, 'change', this.updateProcessVariable);

		// Initialize view
		varKeys = _.keys(processVariables.attributes);
		_.each(varKeys, _.bind(function(key) {
			this.updateProcessVariable(processVariables, key);
		}, this));
	},

	render : function () {
		"use strict";

		var processInputs = this.model.getProcessInputs();

		if (processInputs) {
			this.$el.html(this.template({
				"job" : this.model.attributes,
				"inputs" : processInputs
			}));
		}
		return this;
	},

	_getKeyFromId : function(id) {
		return id.replace('input-', '');
	},

	/*
	 * Hook for updating text process variable
	 * @param {Jquery event } ev
	 */
	changeTextProcessVariable : function(ev) {
		"use strict";
		var key = this._getKeyFromId(ev.target.id);
		var processVariables = this.model.get('processVariables');
		var newVal = {};

		newVal[key] = ev.target.value;
		processVariables.set(newVal, key);
	},

	/*
	 * Hook for updating boolean process variable
	 * @param {Jquery event } ev
	 */
	changeBooleanProcessVariable : function(ev) {
		"use strict";
		var key = this._getKeyFromId(ev.target.id);
		var processVariables = this.model.get('processVariables');
		var newVal = {};
		newVal[key] = ev.target.checked ? 'true' : 'false';
		processVariables.set(newVal, key);
	},

	/*
	 * Hook for updating choice process variable
	 * @param {Jquery event} ev
	 *
	 */
	changeSelectProcessVariable : function(ev) {
		"use strict";
		var key = ev.target.id.replace('input-', '');
		var processVariables = this.model.get('processVariables');
		var newVal = {};

		if (ev.target.multiple) {
			newVal[key] = _.map(ev.target.selectedOptions, function(v) {
				return v.value;
			});
		}
		else {
			newVal[key] = ev.target.value;
		}
		processVariables.set(newVal, key);
	},

	changeEmail : function(ev) {
		"use strict";
		this.model.set('email', ev.target.value);
	},

	changeFilename : function(ev) {
		"use strict";
		this.model.set('filename', ev.target.value);
	},

	/*
	 * Updates the DOM element representing the process variable
	 * varKey to reflect the contents of the model
	 * @param {GDP.model.ProcessVariablesModel}
	 * @param {String} varKey
	 */
	updateProcessVariable : function(model, varKey) {
		"use strict";
		var value = model.get(varKey);
		var $inputEl = $('#input-' + varKey);
		if ((value === 'true') || (value === 'false')) {
			$inputEl.prop('checked', value === 'true');
		}
		else {
			$inputEl.val(model.get(varKey));
		}
	}
});