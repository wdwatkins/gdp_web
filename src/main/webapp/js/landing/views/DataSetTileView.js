/*jslint browser: true*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSetTileView = GDP.util.BaseView.extend({

		events : {
			'click .dataset-tile-div' : 'showDetails'
		},

		initialize : function(options) {
			var bounds;
			this.context = this.model.attributes.csw;
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

		showDetails : function(ev) {
			this.detailView = new GDP.LANDING.views.DataSetDialogView({
				model : this.model,
				template : GDP.LANDING.templates.getTemplate('data_set_dialog'),
				router : this.router,
				el : this.$dialogEl
			});
		}
	});
}());
