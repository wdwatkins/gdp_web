/*jslint browser: true*/
/*global Backbone*/
/*global OpenLayers*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSetTileView = GDP.util.BaseView.extend({

		events : {
			'click .dataset-tile-div' : 'showDetails'
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *     @prop router {Backbone.Router instance} - defaults to null
		 *	   @prop template {Handlerbars template function} - defaults to loading the template from NWC.templates - this is useful for testing
		 *	   @prop model {GDP.models.DataSetModel}
		 *	   @prop dialogEl {Jquery element} - The jquery element for the modal dialog
		 *	   @prop el {Jquery element} - optional
		 * @returns {GDP.LANDING.views.DataSetTileView}
		 */
		initialize : function(options) {
			var bounds;
			this.context = this.model.attributes;
			this.$dialogEl = options.dialogEl;

			var baseLayers = [GDP.util.mapUtils.createWorldStreetMapLayer()];
			this.map = GDP.util.mapUtils.createMap(baseLayers, []);

			this.boundsLayer = new OpenLayers.Layer.Vector('Dataset extent');
			bounds = GDP.util.mapUtils.transformWGS84ToMercator(new OpenLayers.Bounds(this.context.bounds.toArray()));
			var boundsFeature = new OpenLayers.Feature.Vector(bounds.toGeometry());
			this.boundsLayer.addFeatures([boundsFeature]);
			this.map.addLayer(this.boundsLayer);

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);
			this.map.render(this.$el.find('.dataset-map')[0]);
			this.map.zoomToExtent(bounds);
		},

		/*
		 * Creates a DataSetDialogView for this view's model
		 */
		showDetails : function() {
			this.detailView = new GDP.LANDING.views.DataSetDialogView({
				model : this.model,
				template : GDP.LANDING.templates.getTemplate('data_set_details'),
				router : this.router,
				el : this.$dialogEl
			});
		},

		/*
		 * Sets the visibility of the view to isVisible.
		 * @param {Boolean} isVisible
		 */
		setVisibility : function(isVisible) {
			if (isVisible) {
				this.$el.show();
			}
			else {
				this.$el.hide();
			}
		}
	});
}());
