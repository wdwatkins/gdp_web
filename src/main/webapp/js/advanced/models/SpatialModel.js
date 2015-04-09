/*jslint browser: true*/
/*global Backbone*/

var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {}

GDP.ADVANCED.model = GDP.ADVANCED.model || {};

GDP.ADVANCED.model.SpatialModel = Backbone.Model.extend({

	defaults : {
		name : '',
		attribute : '',
		values : []
	}
});


