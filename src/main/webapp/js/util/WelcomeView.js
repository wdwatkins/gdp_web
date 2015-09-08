/*jslint browser: true */
/*global $*/

var GDP = GDP || {};

GDP.util = GDP.util || {};
(function() {
	"use strict";

	GDP.util.WelcomeView = GDP.util.BaseView.extend({

		events : {
			'click .toggle-welcome' : 'toggleWelcome'
		},

		toggleWelcome : function() {
			var $button = this.$('.toggle-welcome');
			var $buttonIcon = $button.find('i');
			var $welcomeDiv = this.$('.welcome-jumbotron');

			if ($button.attr('title') === 'Hide welcome') {
				$welcomeDiv.slideUp();
				$button.attr('title', 'Show welcome');
				$buttonIcon.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
			}
			else {
				$welcomeDiv.slideDown();
				$button.attr('title', 'Hide welcome');
				$buttonIcon.removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
			}
		}
	});

}());

