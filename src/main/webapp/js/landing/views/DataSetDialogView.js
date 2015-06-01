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
			var context = this.model.get('csw');
			context.dataSources = this.model.getDataSources();
			context.contactInfo = this.model.getContactInfo();
			context.algorithms = GDP.algorithms.get('gdpAlgorithms')[context.identifier];
			context.timeRange = this.model.getDataSetTimeRange();
			context.distributionInfo = this.model.getDistributionTransferOptions();
			var html = this.template(context);
			this.$el.find('.modal-body').html(html);
			this.$el.find('.modal-footer').show();

			return this;
		},

		/*
		 * @param {Object} options
		 *     @prop {Function} template - returns the rendered html.
		 *     @prop {GDP.LANDING.models.DataSetModel} model
		 *     @prop {Jquery element} el - This is expected to contain the framework for a bootstrap
		 *         modal where el represents the div with the modal class and within that div is a modal-content
		 *         class.
		 */
		initialize : function(options) {
			var self = this;

			this.$el.find('.modal-body').html('<div class="text-center"><i class=" fa fa-5x fa-spin fa-refresh"></i></div>');
			this.$el.find('.modal-footer').hide();
			this.$el.modal({});
			options = options || {};
			if (_.has(options, 'template')) {
				this.template = options.template;
			}
			else {
				this.template = function() { return 'No template specified'; };
			}
			var getRecord = $.Deferred();
			var isoMetadata = self.model.get('isoMetadata');
			if (_.isEmpty(isoMetadata)) {
				GDP.cswClient.requestGetRecordById({
					outputSchema : 'http://www.isotc211.org/2005/gmd',
					id : this.model.get('csw').identifier
				}).done(function(response) {
					self.model.set('isoMetadata', response.records[0]);
					getRecord.resolve(response.records[0]);
				}).fail(function(error) {
					GDP.logger.error('GetRecordsById failed');
					getRecord.reject(error);
				});
			}
			else {
				getRecord.resolve(isoMetadata);
			}

			Backbone.View.prototype.initialize.apply(this, arguments);

			getRecord.done(function(response) {
				self.render();
			}).fail(function(error) {
				self.$el.find('.modal-body').html('Retrieving meta data failed with error: ' + error);
			});
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
			window.location.assign('process_client/' + this.model.get('csw').identifier);
			this.remove();
		}

	});

}());


