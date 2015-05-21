/*jslint browser: true*/
/*global Backbone*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.controller = GDP.LANDING.CONTROLLER || {};

(function() {
	"use strict";
	GDP.LANDING.controller.LandingRouter = Backbone.Router.extend({
		applicationContextDiv : '#home-page-content',

		routes : {
			'' : 'home'
		},

		home : function() {
			this.showView(GDP.LANDING.views.DataSourceSelectionView, {
				template : GDP.LANDING.templates.getTemplate('datasource_select')
			});
		},

		showView : function(view, opts) {
			var newEl = $('<div>');

			this.removeCurrentView();
			$(this.applicationContextDiv).append(newEl);
			this.currentView = new view($.extend({
				el: newEl,
				router: this
			}, opts));
		},

		removeCurrentView : function() {
			if (this.currentView) {
				this.currentView.remove();
			}
		}
	});
}());


