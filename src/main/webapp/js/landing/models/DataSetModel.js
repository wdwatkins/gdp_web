/*jslint browser: true*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.models = GDP.LANDING.models || {};

(function() {
	"use strict";

	GDP.LANDING.models.DataSetModel = Backbone.Model.extend({
		defaults : {
			csw : {},
			isoMetadata : {}
		}
	});

	GDP.LANDING.models.DataSetCollection = Backbone.Collection.extend({
		model : GDP.LANDING.models.DataSetModel
	});
}());


