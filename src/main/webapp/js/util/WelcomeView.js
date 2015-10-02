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
			buttonIcon : 'fa-angle-double-up'
		},
		HIDE_WELCOME : {
			buttonTitle : 'Show welcome',
			buttonIcon : 'fa-angle-double-down'
		},

		/*
		 * @param options
		 *      @prop {Function} template - returns a function which will render a template
		 *      @prop {String} el - Jquery selector where this content should be rendered
		 *      @prop {Boolean} hide - optional. Set to true if content should initially be hidden.
		 *      @prop {Boolean} isLandingPage. Set to true if you want the full welcome.
		 */
		initialize : function(options) {
			this.context = {
				aoiMessageContext : this._getAreasOfInterestMessageContext(),
				incomingParams : GDP.incomingParams,
				isLandingPage : options.isLandingPage
			};
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

		_getAreasOfInterestMessageContext : function() {
			var context = {};
			var parser;
			var host;
			var protocol;
			if (GDP.incomingParams.caller && GDP.incomingParams.item_id) {
				if (GDP.incomingParams.caller.toLowerCase() === 'sciencebase') {
					/* We need to build the sciencebase url since its not included in the
					 * request params.  Params passed in via ScienceBase look like:
					 * 				caller: "sciencebase"
					 *		 		development: "false"
					 *		 		feature_wfs: "https://www.sciencebase.gov/catalogMaps/mapping/ows/54296bf0e4b0ad29004c2fbb"
					 *		 		feature_wms: "https://www.sciencebase.gov/catalogMaps/mapping/ows/54296bf0e4b0ad29004c2fbb"
					 *		 		item_id: "54296bf0e4b0ad29004c2fbb"
					 *		 		ows: "https://www.sciencebase.gov/catalogMaps/mapping/ows/54296bf0e4b0ad29004c2fbb"
					 *		 		redirect_url: "https://www.sciencebase.gov/catalog/gdp/landing/54296bf0e4b0ad29004c2fbb"
					 *
					 *		URL to sciencebase looks like:
					 *				https://www.sciencebase.gov/catalog/item/54296bf0e4b0ad29004c2fbb
					 *
					 * So first thing is to get the request host
					 */
					parser = document.createElement('a');
					parser.href = GDP.incomingParams.redirect_url;

					host = parser.hostname;
					protocol = parser.protocol;
					context.sciencebase = {
						url : protocol + "//" + host + "/catalog/item/" + GDP.incomingParams.item_id
					};
				}
				else {
					context.defaultCaller = {
						itemId : GDP.incomingParams.item_id,
						caller : GDP.incomingParams.caller
					};
				}
			}
			return context;
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

