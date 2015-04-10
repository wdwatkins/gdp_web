/*jslint browser: true*/
/*global _*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.ProcessView = GDP.util.BaseView.extend({
	
	algorithmConfigView : null,
	
	events : {
		"click .menu-dropdown-select-process" : "selectProcess"
	},
	
	render : function () {
		"use strict";
		this.$el.html(this.template(this.collection.models));
		this.algorithmConfigView = new GDP.view.AlgorithmConfigView({
			template : GDP.ADVANCED.templates.getTemplate('algorithm-config'),
			model : GDP.ADVANCED.Job
		});
		this.algorithmConfigView.processModelsCollection = this.collection;
		this.algorithmConfigView.$el = this.$("#container-process-configuration");
		return this;
	},
	
	/**
	 * Removes all other descriptions and only displays the algorithm description
	 * matching to name provided in parameter
	 * 
	 * @param {String} algorithmName
	 * @returns {Object} 
	 */
	displayAlgorithmDescription : function (algorithmName) {
		"use strict";
		
		if (!algorithmName) {
			return;
		}
		
		var $selectedDescription = $('#process-description-' + algorithmName);
		
		if ($selectedDescription.length === 0) {
			// Couldn't find a process description with that name
			return;
		}
		
		// Remove all descriptions and show only the selected algorithm description
		$('#container-process-description').children().not($selectedDescription).fadeOut(function () {
			$selectedDescription.fadeIn();
		});
		
		return $selectedDescription;
	},
	
	/**
	 * Hook for process selection from dropdown
	 * @param {JQuery event} evt
	 * @returns {undefined}
	 */
	selectProcess : function (evt) {
		"use strict";
		var targetId = evt.target.id;
		var algorithmName = _.last(targetId.split('-'));
		
		GDP.ADVANCED.Job.set('algorithmId', this.collection.getByName(algorithmName).get('id'));
		this.displayAlgorithmDescription(algorithmName);
		this.algorithmConfigView.render();
		this.algorithmConfigView.delegateEvents();
	}
});