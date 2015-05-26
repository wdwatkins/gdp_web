/*jslint browser: true*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSetTileView = GDP.util.BaseView.extend({

		initialize : function(options) {
			this.context = this.model.attributes;

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);
		}
	});
}());
