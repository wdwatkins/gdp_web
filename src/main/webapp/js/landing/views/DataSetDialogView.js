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

		render : function() {
			var context = this.model.get('csw');
			context.dataSources = this.model.getDataSources();
			context.contactInfo = this.model.getContactInfo();
			context.algorithms = GDP.algorithms.get('gdpAlgorithms')[context.identifier];
			context.timeRange = this.model.getDataSetTimeRange();
			context.distributionInfo = this.model.getDistributionTransferOptions();
			var html = this.template(context);
			this.$el.find('.modal-content').html(html);

			return this;
		},

		initialize : function(options) {
			var self = this;
			options = options || {};
			if (_.has(options, 'template')) {
				this.template = options.template;
			}
			else {
				this.template = function() { return 'No template specified'; };
			}

			var getRecord = GDP.cswClient.requestGetRecordById({
				outputSchema : 'http://www.isotc211.org/2005/gmd',
				id : this.model.get('csw').identifier
			});

			Backbone.View.prototype.initialize.apply(this, arguments);

			getRecord.done(function(response) {
				GDP.logger.debug('Get Record');
				self.model.set('isoMetadata', response.records[0]);
				self.render();
				self.$el.modal({});

			}).fail(function(error) {
				GDP.logger.error('GetRecords failed when getting a single record');
			});
		},

		removeDialog : function() {
			this.$el.modal('hide');
			this.remove();
		},

		goToProcessClient : function() {
			window.location.assign('process_client/' + this.model.get('csw').identifier);
			this.remove();
		}

	});

}());


