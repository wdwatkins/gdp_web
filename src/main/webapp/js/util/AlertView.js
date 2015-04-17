/*global Backbone*/
/*global Handlebars*/
/*global $*/

var GDP = GDP || {};

GDP.util = GDP.util || {};


(function() {
	"use strict";

	GDP.util.AlertView = Backbone.View.extend({
		render : function() {
			this.$el.append(this.template({
				message : this.message,
				alertClass : this.alertClass
			}));
		},

		initialize : function(options) {
			this.$el = $(options.el);
			var html = '<div class="alert {{alertClass}} alert-dismissable" role="alert">' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'{{message}}' +
				'</div>';
			this.template = Handlebars.compile(html);

		},

		show : function(alertClass, message) {
			this.$el.find('.alert').remove();
			this.alertClass = alertClass;
			this.message = message;
			this.render();
		}
	});
}());


