/*jslint browser: true*/
/*global $*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.views = GDP.LANDING.views || {};

(function() {
	"use strict";

	GDP.LANDING.views.DataSourceSelectionView = GDP.util.BaseView.extend({
		render : function() {
			GDP.util.BaseView.prototype.render.apply(this, arguments);

			$('#datasource-select').select2({
					placeholder : 'Select data source'
			});
			return this;
		}
	});
}());


