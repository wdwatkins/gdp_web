/*jslint browser: true*/
/*global _*/
/*global $*/
var GDP = GDP || {};
GDP.ADVANCED = GDP.ADVANCED || {};
GDP.ADVANCED.view = GDP.ADVANCED.view || {};

(function() {
	"use strict";
	GDP.ADVANCED.view.ProcessView = GDP.util.BaseView.extend({

		algorithmConfigView : null,

		events : {
			"click .menu-dropdown-select-process" : "selectProcess",
			"click #done-btn" : "goToHub"
		},

		/*
		 * @constructor
		 * @{Object} options
		 *    @prop {Function} template
		 *    @prop {Backbone.model} model
		 */
		initialize : function(options) {
			var process;
			this.algorithmTemplate = options.algorithmTemplate;
			GDP.util.BaseView.prototype.initialize.apply(this, arguments);

			this.listenTo(this.model, 'change:algorithmId', this.displayAlgorithmDescription);
		},

		render : function () {
			// Hiding the rendered template until the selected algorithm description is shown so that
			// there isn't flashing when an algorithm has already been selected
			this.$el.hide();
			this.$el.html(this.template(this.model.attributes));
			this.displayAlgorithmDescription();
			this.$el.show();

			this.algorithmConfigView = new GDP.ADVANCED.view.AlgorithmConfigView({
				template : this.algorithmTemplate,
				model : this.model,
				el : '#container-process-configuration'
			});

			return this;
		},

		/**
		 * Removes all other descriptions and only displays the algorithm description
		 * that matches this.model's algorithmId. Does nothing if algorithmId is not defined
		 * or if the algorithm's description can't be found in the DOM.
		 *
		 * @returns {Object} - The container containing the algorithm's description
		 */
		displayAlgorithmDescription : function () {
			var process = this.model.getSelectedAlgorithmProcess();
			var algorithmName = (process) ? process.get('name') : '';

			var $selectedDescription = $('#process-description-' + algorithmName);

			if ($selectedDescription.length === 0) {
				// Couldn't find a process description with that name
				return $selectedDescription;
			}

			// Remove all descriptions and show only the selected algorithm description
			$('#container-process-description').children().not($selectedDescription).hide();
			$selectedDescription.show();


			return $selectedDescription;
		},

		/**
		 * Hook for process selection from dropdown
		 * @param {JQuery event} evt
		 * @returns {undefined}
		 */
		selectProcess : function (evt) {
			var targetId = evt.target.id;
			var algorithmName = _.last(targetId.split('-'));

			this.algorithmConfigView.remove();
			this.model.get('processVariables').clear({silent : true});
			this.model.set('algorithmId', this.model.get('processes').findWhere({'name': algorithmName}).get('id'));
			// initialize processVariables from the defaults in the selected process.
			var selectedProcessInputs = this.model.getProcessInputs();
			var processVars = {};
			_.each(selectedProcessInputs, function(input) {
				processVars[input.identifier] = input.default;
			});
			this.model.get('processVariables').set(processVars);

			this.algorithmConfigView = new GDP.ADVANCED.view.AlgorithmConfigView({
				template : this.algorithmTemplate,
				model : this.model,
				el : '#container-process-configuration'
			});
		},

		/**
		 * Navigates to the hub page.
		 * @param {Jquery event} evt
		 * @returns {undefined}
		 */
		goToHub : function(evt) {
			this.router.navigate("/", {trigger : true});
		},

		remove : function() {
			this.algorithmConfigView.remove();
			GDP.util.BaseView.prototype.remove.apply(this, arguments);
		}
	});
}());