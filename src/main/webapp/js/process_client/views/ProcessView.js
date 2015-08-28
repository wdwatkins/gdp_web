/*jslint browser: true*/
/*global _*/
/*global $*/
var GDP = GDP || {};
GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};
GDP.PROCESS_CLIENT.view = GDP.PROCESS_CLIENT.view || {};

(function() {
	"use strict";
	GDP.PROCESS_CLIENT.view.ProcessView = GDP.util.BaseView.extend({

		algorithmConfigView : null,

		events : {
			"click .menu-dropdown-select-process" : "selectProcess",
			"submit form" : "goToHubPage"
		},

		/*
		 * @constructor
		 * @{Object} options
		 *    @prop {Function} template
		 *    @prop {Backbone.model} model
		 */
		initialize : function(options) {
			var self = this;
			var initArguments = arguments;

			this.algorithmTemplate = options.algorithmTemplate;
			this.routePrefix = options.datasetId ? 'catalog/gdp/dataset/' + options.datasetId  : 'advanced';

			this.model.updateDataSetModel(options.datasetId).always(function() {
				GDP.util.BaseView.prototype.initialize.apply(self, initArguments);
				self.listenTo(self.model, 'change:algorithmId', self.displayAlgorithmDescription);
			}).fail(function() {
				self.alertView = new GDP.util.AlertView({
					el : '#messages-div'
				});
				self.alertView.show('alert-danger', 'Unable to load information about the dataset, ' + options.datasetId);
			});
		},

		render : function () {
			// Hiding the rendered template until the selected algorithm description is shown so that
			// there isn't flashing when an algorithm has already been selected
			this.$el.hide();
			var context = this.model.clone().attributes;
			var dataSetModel = this.model.get('dataSetModel');
			context.allowedAlgorithms = _.chain(dataSetModel.get('algorithms'))
				.sortBy('type')
				.groupBy('type')
				.value();

			this.$el.html(this.template(context));
			this.displayAlgorithmDescription();
			this.$el.show();

			this.algorithmConfigView = new GDP.PROCESS_CLIENT.view.AlgorithmConfigView({
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
			_.each(selectedProcessInputs, function(i) {
				processVars[i.identifier] = i['default'];
			});
			this.model.get('processVariables').set(processVars);

			this.algorithmConfigView = new GDP.PROCESS_CLIENT.view.AlgorithmConfigView({
				template : this.algorithmTemplate,
				model : this.model,
				el : '#container-process-configuration'
			});
		},

		remove : function() {
			this.algorithmConfigView.remove();
			GDP.util.BaseView.prototype.remove.apply(this, arguments);
		},

		/*
		 * Route back to the hub page.
		 * @param {Jquery event} ev
		 * @returns {undefined}
		 */
		goToHubPage : function(ev) {
			ev.preventDefault();
			this.router.navigate(this.routePrefix, {trigger : true});
		}
	});
}());