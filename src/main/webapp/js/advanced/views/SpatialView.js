/*jslint browser: true*/
/*global Backbone*/
/*global _*/

var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.SpatialView = GDP.util.BaseView.extend({

	getAvailableFeatures : function() {
		var populateFeatureTypesSelectBox = function(data) { return };
		return GDP.OGC.WFS.callWFS(
			{
				request : 'GetCapabilities'
			},
			false,
			populateFeatureTypesSelectBox
		);
	},

	initialize : function(options) {
		GDP.util.BaseView.prototype.initialize.apply(this, arguments);
		this.getAvailableFeatures().then(
			function() {
				GDP.logger.debug('GDP.view.SpatialView getAvailableFeatures successful');
			},
			function() {
				GDP.logger.debug('GDP.view.SpatialView getAvailableFeatures failed');
			}
		);
	}

});


