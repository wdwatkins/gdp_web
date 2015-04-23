/*jslint browser: true*/
/*global Backbone*/
/*global _*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};
GDP.ADVANCED.view = GDP.ADVANCED.view || {};

(function() {
	"use strict";
	GDP.ADVANCED.view.AlgorithmConfigView = GDP.util.BaseView.extend({

		events : {
			'change #process-algorithm-configuration-description input[type="text"]' : 'changeTextProcessVariable',
			'change #process-algorithm-configuration-description input[type="checkbox"]' : 'changeBooleanProcessVariable',
			'change #process-algorithm-configuration-description select' : 'changeSelectProcessVariable'

		},

		/*
		 * @constructor
		 * @param {Object} options
		 *     @prop {Function} template
		 *     @prop {Backbone.model} model,
		 *     @prop {String} el
		 */
		initialize : function(options) {
			var processVariables;
			var varKeys;

			this.$el = $(options.el);

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);

			// Set up model listeners
			processVariables = this.model.get('processVariables');
			this.listenTo(processVariables, 'change', this.updateProcessVariable);
			this.listenTo(this.model, 'change:algorithmId', this.render);

			// Initialize view
			varKeys = _.keys(processVariables.attributes);
			_.each(varKeys, _.bind(function(key) {
				this.updateProcessVariable(processVariables, key);
			}, this));
		},

		render : function () {
			"use strict";

			var algorithmId = this.model.get('algorithmId');
			var processes = this.model.get('processes');
			var algorithm = processes.findWhere({'id' : algorithmId});

			if (algorithm) {
				this.$el.html(this.template({
					"job" : this.model.attributes,
					"inputs" : algorithm.get('inputs')
				}));
			}
			return this;
		},

		/*
		 * Hook for updating text process variable
		 * @param {Jquery event } ev
		 */
		changeTextProcessVariable : function(ev) {
			var key = ev.target.id.replace('input-', '');
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
			var key = ev.target.id.replace('input-', '');
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

		/*
		 * Updates the DOM element representing the process variable
		 * varKey to reflect the contents of the model
		 * @param {GDP.model.ProcessVariablesModel}
		 * @param {String} varKey
		 */
		updateProcessVariable : function(model, varKey) {
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
}());