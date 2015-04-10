/*jslint browser: true*/
/*global _*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.ProcessView = GDP.util.BaseView.extend({
	events : {
		"click .menu-dropdown-select-process" : "selectProcess"
	},
	
	render : function () {
		"use strict";
		this.$el.html(this.template(this.collection.models));
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
	
	selectProcess : function (evt) {
		"use strict";
		var targetId = evt.target.id;
		var algorithmName = _.last(targetId.split('-'));
		
		this.displayAlgorithmDescription(algorithmName);
	}
});