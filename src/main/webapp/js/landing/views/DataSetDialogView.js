/*jslint browser: true*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSetDialogView = Backbone.View.extend({

		events : {
			'click .cancel-btn' : 'removeDialog',
			'click .process-btn' : 'goToProcessClient'
		},

		/*
		 * Renders the template using a context that is created from the model and GDP.algorithms and places
		 * the contents in the .modal-content element within the passed in el.
		 */
		render : function() {
			var context = this.model.attributes;
			var html = this.template(context);
			this.$el.find('.dataset-dialog-contents').html(html);

			return this;
		},

		/*
		 * @param {Object} options
		 *     @prop {Function} template - returns the rendered html.
		 *     @prop {GDP.models.DataSetModel} model
		 *     @prop {Jquery element} el - This is expected to contain the framework for a bootstrap
		 *         modal where el represents the div with the modal class and within that div is a modal-content
		 *         class.
		 */
		initialize : function(options) {
			var self = this;
			this.$el.find('.dataset-dialog-loading-indicator').hide();
			this.$el.modal({});
			options = options || {};
			if (_.has(options, 'template')) {
				this.template = options.template;
			}
			else {
				this.template = function() { return 'No template specified'; };
			}

			Backbone.View.prototype.initialize.apply(this, arguments);
			this.render();
		},

		/*
		 * Hide dialog and remove the view
		 */
		removeDialog : function() {
			this.$el.modal('hide');
			this.remove();
		},

		/*
		 * Go to the process_client using the dataset identifier in the url.
		 */
		goToProcessClient : function() {
			window.location.assign('catalog/gdp/dataset/' + this.model.get('identifier') + '/');
			this.remove();
		}

	});

}());


