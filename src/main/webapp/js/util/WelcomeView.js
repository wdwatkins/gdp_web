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

		SHOW_WELCOME : {
			buttonTitle : 'Hide welcome',
			buttonIcon : 'fa-angle-double-down'
		},
		HIDE_WELCOME : {
			buttonTitle : 'Show welcome',
			buttonIcon : 'fa-angle-double-up'
		},

		/*
		 * @param options
		 *      @prop {Function} template - returns a function which will render a template
		 *      @prop {String} el - Jquery selector where this content should be rendered
		 *      @prop {Boolean} hide - optional. Set to true if content should initially be hidden.
		 */
		initialize : function(options) {
			this.context = {};
			if (!_.has(options, 'hide')) {
				options.hide = false;
			}
			if (options.hide) {
				this.context.button = this.HIDE_WELCOME;
			}
			else {
				this.context.button = this.SHOW_WELCOME;
			}
			this.context.hide = options.hide;
			GDP.util.BaseView.prototype.initialize.apply(this, arguments);
		},

		hideWelcome : function() {
			var $button = this.$('.toggle-welcome');
			var $buttonIcon = $button.find('i');
			var $welcomeDiv = this.$('.welcome-jumbotron');

			$welcomeDiv.slideUp();
			$button.attr('title', this.HIDE_WELCOME.buttonTitle);
			$buttonIcon.removeClass(this.SHOW_WELCOME.buttonIcon).addClass(this.HIDE_WELCOME.buttonIcon);
		},

		showWelcome : function() {
			var $button = this.$('.toggle-welcome');
			var $buttonIcon = $button.find('i');
			var $welcomeDiv = this.$('.welcome-jumbotron');

			$welcomeDiv.slideDown();
			$button.attr('title', this.SHOW_WELCOME.buttonTitle);
			$buttonIcon.removeClass(this.HIDE_WELCOME.buttonIcon).addClass(this.SHOW_WELCOME.buttonIcon);

		},
		toggleWelcome : function() {
			if (this.$('.toggle-welcome').attr('title') === this.SHOW_WELCOME.buttonTitle) {
				this.hideWelcome();
			}
			else {
				this.showWelcome()
			}
		}
	});

}());

