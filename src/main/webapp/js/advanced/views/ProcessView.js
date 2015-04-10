/*jslint browser: true*/

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
	
	selectProcess : function (evt) {
		"use strict";
		var targetId = evt.target.id;
		var processName = _.last(targetId.split('-'));
		var $selectedDescription = $('#process-description-' +processName);
		
		// Remove all descriptions and show only the selected algorithm description
		$('#container-process-description').children().not($selectedDescription).fadeOut(function () {
			$selectedDescription.fadeIn();
		});
	}
});