/*jslint browser: true*/
/*global $*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSourceSelectionView = GDP.util.BaseView.extend({

		/*
		 * @constructs
		 * @param {Object} options
		 *	   @prop collection {GDP.LANDING.models.DataSetCollection}
		 *     @prop router {Backbone.Router instance} - defaults to null
		 *	   @prop template {Handlerbars template function} - defaults to loading the template from NWC.templates - this is useful for testing
		 *	   @prop context {Object} to be used when rendering templateName - defaults to {}
		 *	   @prop el {Jquery element} optional
		 * @returns GDP.LANDING.views.DataSourceSelectionView
		 */
		initialize : function(options) {
			var self = this;
			var getCswRecords = GDP.cswClient.requestGetRecords({});

			this.dataSetViews = [];

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);

			this.$dataSetTileContainer = $('.dataset-tile-container');

			getCswRecords.done(function(response) {
				var dataSetModels = _.chain(response.records)
					.map(function(record) {
						return new self.collection.model(record);
					})
					.sortBy(function(model) {
						return model.attributes.title
					})
					.value();
				self.dataSetViews = _.map(dataSetModels, function(model) {
					var template = GDP.LANDING.templates.getTemplate('data_set_tile');
					var newEl = $('<div>');
					self.$dataSetTileContainer.append(newEl);
					return new GDP.LANDING.views.DataSetTileView({
						model : model,
						template : template,
						router : self.router,
						el : newEl,
						dialogEl : self.$el.find('.modal')
					});
				});

				self.collection.set(dataSetModels);
			}).fail(function(error) {
				self.$dataSetTileContainer.html('CSW service is unavailable:' & error);
				GDP.logger.debug('Got CSW GetRequest error');
			}).always(function() {
				self.$el.find('.tile-loading-indicator').hide();
			});

		}
	});
}());


