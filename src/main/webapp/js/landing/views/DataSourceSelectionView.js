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
				algorithmFilters : _.keys(this.algorithmFilters),
				aoiMessageContext : this._getAreasOfInterestMessageContext(),
				incomingParams : GDP.incomingParams,
				baseUrl : GDP.BASE_URL
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
				self.$dataSetTileContainer.html('<h3>Sorry, the catalog contents are not available right now, please check back later.</h3>');
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
		},

		_getAreasOfInterestMessageContext : function() {
			var context = {};
			var parser;
			var host;
			var protocol;
			if (GDP.incomingParams.caller && GDP.incomingParams.item_id) {
				if (GDP.incomingParams.caller.toLowerCase() === 'sciencebase') {
					/* We need to build the sciencebase url since its not included in the
					 * request params.  Params passed in via ScienceBase look like:
					 * 				caller: "sciencebase"
					 *		 		development: "false"
					 *		 		feature_wfs: "https://www.sciencebase.gov/catalogMaps/mapping/ows/54296bf0e4b0ad29004c2fbb"
					 *		 		feature_wms: "https://www.sciencebase.gov/catalogMaps/mapping/ows/54296bf0e4b0ad29004c2fbb"
					 *		 		item_id: "54296bf0e4b0ad29004c2fbb"
					 *		 		ows: "https://www.sciencebase.gov/catalogMaps/mapping/ows/54296bf0e4b0ad29004c2fbb"
					 *		 		redirect_url: "https://www.sciencebase.gov/catalog/gdp/landing/54296bf0e4b0ad29004c2fbb"
					 *
					 *		URL to sciencebase looks like:
					 *				https://www.sciencebase.gov/catalog/item/54296bf0e4b0ad29004c2fbb
					 *
					 * So first thing is to get the request host
					 */
					parser = document.createElement('a');
					parser.href = GDP.incomingParams.redirect_url;

					host = parser.hostname;
					protocol = parser.protocol;
					context.sciencebase = {
						url : protocol + "//" + host + "/catalog/item/" + GDP.incomingParams.item_id
					};
				}
				else {
					context.defaultCaller = {
						itemId : GDP.incomingParams.item_id,
						caller : GDP.incomingParams.caller
					};
				}
			}
			return context;
		}


	});
}());


