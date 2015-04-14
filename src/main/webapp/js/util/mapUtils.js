/*jslint browser: true*/
/*global OpenLayers*/

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
		var maxExtent = new OpenLayers.Bounds(GDP.config.get('map').extent.conus['3857']);

		var defaultConfig = {
			extent: maxExtent,
			restrictedExtent: maxExtent,
			projection: that.WGS84_GOOGLE_MERCATOR,
			numZoomLevels: 13
		};
		defaultConfig.layers = layers;
		defaultConfig.controls = controls;

		return new OpenLayers.Map(defaultConfig);
	};

	return that;
}());



