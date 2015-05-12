/*jslint browser: true*/
/*global OpenLayers*/
/*global _*/

var GDP = GDP || {};

GDP.util = GDP.util || {};

GDP.util.mapUtils = (function() {
	"use strict";

	var that = {};

	that.WGS84_GOOGLE_MERCATOR = new OpenLayers.Projection("EPSG:3857");
	that.WGS84_GEOGRAPHIC = new OpenLayers.Projection("EPSG:4326");

	var EPSG3857Options = {
		sphericalMercator: true,
		layers: "0",
		isBaseLayer: true,
		projection: that.WGS84_GOOGLE_MERCATOR,
		units: "m",
		buffer: 3,
		transitionEffect: 'resize',
		wrapDateLine: true
	};
	var zyx = '/MapServer/tile/${z}/${y}/${x}';

	that.createWorldStreetMapLayer = function() {
		return new OpenLayers.Layer.XYZ(
			"World Street Map",
			"http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map" + zyx,
			{
				isBaseLayer: true,
				units: "m",
				wrapDateLine: true
			}
		);
	};

	that.transformWGS84ToMercator = function(lonLat) {
		return lonLat.transform(that.WGS84_GEOGRAPHIC, that.WGS84_GOOGLE_MERCATOR);
	};

	that.createMap = function(layers, controls) {
		var maxExtent = that.transformWGS84ToMercator(new OpenLayers.Bounds(-179.0, 10.0, -42.0, 75.0));

		var defaultConfig = {
			restrictedExtent : maxExtent,
			projection: that.WGS84_GOOGLE_MERCATOR,
			numZoomLevels: 13
		};
		defaultConfig.layers = layers;
		defaultConfig.controls = controls;

		return new OpenLayers.Map(defaultConfig);
	};

	/*
	 * @param {String} name - WMS layer name
	 * @param {Object} params (optional) - params to be added to the default params in the layer creation call
	 * @param {Object} options (optional) - params to be added to the default options in the layer creation call.
	 * @return {OpenLayers.Layer.WMS}
	 */
	that.createAOILayer = function(name, params, options) {
		var layerParams = {
			transparent : true
		};
		var layerOptions = {
			opacity: 0.6,
			displayInLayerSwitcher : false,
			visibility : true,
			isBaseLayer : false
		};
		_.extend(layerParams, params, {layers : name});
		_.extend(layerOptions, options);

		return new OpenLayers.Layer.WMS(
			'Area of Interest',
			GDP.config.get('application').endpoints.geoserver + '/wms?',
			layerParams,
			layerOptions
		);
	};

	/*
	 * @param {String} attribute
	 * @param {Array of String} values - values to include in filter
	 * @return String that can be used as a CQL filter
	 */
	that.createAOICQLFilter = function(attribute, values) {
		var escValues = _.map(values, function(v) {
			return '\'' + v + '\'';
		});
		return attribute + ' IN (' + escValues.join(',') + ')';
	};

	/*
	 * @param {String} name - layer name
	 * @param {String} filter - CQL filter which will be set in the params
	 * @param {Object} params (optional) - params to add to the default params. Note filter will override any filter setting in params
	 * @param {Object} options (optional) - params to add to the default options.
	 * @return OpenLayers.Layer.WMS
	 */
	that.createAOIFeaturesLayer = function(name, filter, params, options) {
		var layerParams = {
			transparent : true,
			styles : 'highlight'
		};
		var layerOptions = {
			opacity : 0.6,
			displayInLayerSwitcher : false,
			visibility : true,
			isBaseLayer : false,
			singleTile : true,
			tileOptions: {
				// http://www.faqs.org/rfcs/rfc2616.html
				// This will cause any request larger than this many characters to be a POST
				maxGetUrlLength: 1024
			}
		};

		_.extend(layerParams, params, {
			layers : name,
			cql_filter : filter
		});
		_.extend(layerOptions, options);

		return new OpenLayers.Layer.WMS(
			'Selected AOI',
			GDP.config.get('application').endpoints.geoserver + '/wms?',
			layerParams,
			layerOptions
		);
	};

	return that;
}());



