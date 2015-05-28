/*jslint browser: true*/
/*global $*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSourceSelectionView = GDP.util.BaseView.extend({

		initialize : function(options) {
			var self = this;
			var getCswRecords = GDP.cswClient.requestGetRecords({});

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);

			this.$dataSetTileContainer = $('#dataset-tile-container');

			getCswRecords.done(function(response) {
				GDP.logger.debug('Got CSW GetRequest response');
				var dataSetModels = _.map(response.records, function(record) {
					return new self.collection.model({
						csw : {
							abstrct : record['abstract'][0],
							bounds : record.bounds,
							identifier : record.identifier[0].value,
							modified : record.modified[0],
							subject : record.subject,
							title : record.title[0].value,
							type : record.type[0].value
						},
						isoMetadata : {}
					});
				});
				self.dataSetViews = _.map(dataSetModels, function(model) {
					var newEl = $('<div>');
					self.$dataSetTileContainer.append(newEl);
					return new GDP.LANDING.views.DataSetTileView({
						model : model,
						template : GDP.LANDING.templates.getTemplate('data_set_tile'),
						router : self.router,
						el : newEl,
						dialogEl : self.$el.find('.modal')
					});
				});

				self.collection.set(dataSetModels);
			}).fail(function(error) {
				GDP.logger.debug('Got CSW GetRequest error');
			});

		}
	});
}());


