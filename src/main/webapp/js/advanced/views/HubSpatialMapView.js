/*jslint browser: true*/
/*global OpenLayers*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.view = GDP.ADVANCED.view || {};

(function() {
	"use strict";

	GDP.ADVANCED.view.HubSpatialMapView = Backbone.View.extend({

		/**
		 * @constructs
		 * @param {Object} options
		 *     @prop model {model with attributes for aoiName, aoiExtent, aoiAttribute, and aoiAttributeValues
		 *     #prop mapDiv {String} - id of div where map should be rendered
		 */
		initialize : function(options) {
			this.mapDiv = options.mapDiv;
			this.aoiLayer = null;
			this.aoiFeatureLayer = null;

			Backbone.View.prototype.initialize.apply(this, arguments);

			var name = this.model.get('aoiName');
			var attribute = this.model.get('aoiAttribute');
			var values = this.model.get('aoiAttributeValues');
			var filter;

			var baseLayers = [GDP.util.mapUtils.createWorldStreetMapLayer()];
			this.map = GDP.util.mapUtils.createMap(baseLayers, []);

			if (name) {
				this.map.addLayer(GDP.util.mapUtils.createAOILayer(name));

				if ((attribute) && (values.length > 0)) {
					filter = GDP.util.mapUtils.createAOICQLFilter(attribute, values);
					this.map.addLayer(GDP.util.mapUtils.createAOIFeaturesLayer(name, filter));
				}
			}
			this.render();
		},

		render : function() {
			var name = this.model.get('aoiName');
			this.map.render(this.mapDiv);
			if (name) {
				this.map.zoomToExtent(this.model.get('aoiExtent'), true);
			}
			else {
				this.map.zoomToExtent(new OpenLayers.Bounds(GDP.config.get('map').extent.conus['3857']), true);
			}
		}
	});

}());


