/*jslint browser: true*/
/*global $*/
/*global _*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSourceSelectionView = GDP.util.BaseView.extend({

		events : {
			'change .dataset-search-input' : 'filterByText',
			'change .algorithm-type-filter' : 'filterByAlgorithm'
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *	   @prop collection {GDP.models.DataSetCollection}
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

			this.filters = {
				text : '',
				algorithms : []
			};

			this.algorithmFilters =  (_.chain(GDP.config.get('process').processes)
				.map(function(process) {
					return {
						id : process.id,
						type : process.type
					};
				})
				.groupBy('type')
				.value());
			this.context = {
				algorithmFilters : _.keys(this.algorithmFilters)
			};

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);

			this.$dataSetTileContainer = $('.dataset-tile-container');

			getCswRecords.done(function(response) {
				var dataSetModels = _.chain(response.records)
					.map(function(record) {
						return new self.collection.model(record);
					})
					.sortBy(function(model) {
						return model.attributes.title;
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

		},

		/*
		 * Set the visibility of each dataSetView by applying this.filters to it's model.
		 * @returns {undefined}
		 */
		updateFilteredViews : function() {
			_.each(this.dataSetViews, function(view) {
				view.setVisibility(view.model.isInFilter(this.filters));
			}, this);
		},

		/*
		 * Update the text filter with the target's value and then update the visibility of each
		 * dataset's view.
		 * @param {Jquery event}ev
		 */
		filterByText : function(ev) {
			this.filters.text = ev.target.value;
			this.updateFilteredViews();
		},

		/*
		 * Add/remove the target's value from the algorithms filter and then update the
		 * visibility of each dataset's view.
		 * @param {Jquery event} ev
		 */
		filterByAlgorithm : function(ev) {
			var algorithmType = ev.target.value;
			var algorithms = _.pluck(this.algorithmFilters[algorithmType], 'id');
			if (ev.target.checked) {
				this.filters.algorithms = _.union(this.filters.algorithms, algorithms);
			}
			else {
				this.filters.algorithms = _.difference(this.filters.algorithms, algorithms);
			}

			this.updateFilteredViews();
		}


	});
}());


