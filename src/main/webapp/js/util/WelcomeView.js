/*jslint browser: true */
/*global $*/

var GDP = GDP || {};

GDP.util = GDP.util || {};
(function() {
	"use strict";
        
	GDP.util.WelcomeView = GDP.util.BaseView.extend({
            
		events : {
                        'click #copyCitation' :  'copyToClipboard',
                        'click .welcomeToggleButton' : 'toggleWelcomeArea', 
                        'click #gdpGui' : 'toggleWelcomeArea'
		},
		/*
		 * @param options
		 *      @prop {Function} template - returns a function which will render a template
		 *      @prop {String} el - Jquery selector where this content should be rendered
		 *      @prop {Boolean} isLandingPage. Set to true if you want the full welcome.
		 */
		initialize : function(options) {
			this.context = {
                                pathToImages : GDP.BASE_URL,
				aoiMessageContext : this._getAreasOfInterestMessageContext(),
				incomingParams : GDP.incomingParams,
				isLandingPage : options.isLandingPage,
			};
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
                
		toggleWelcomeArea : function() {
                    //Hides Welcome Content
                    this.$('.welcome-content').slideToggle('slow');
                    //Removes margin from top to rest neatly against header
                    this.$('.toggleButtonArea').toggleClass('noMargin');
                    //Triggers animation for toggle button
                    this.$('.welcomeToggleButton').toggleClass('animationTrigger');
                    //Rotatates arrow inside toggle button
                    this.$('.toggleArrow').toggleClass('rotate');
		},
                
                copyToClipboard : function () {
                // create hidden text element, if it doesn't already exist
                    var elem= document.getElementById("copyTarget");
                    var targetId = "_hiddenCopyText_";
                    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
                    var origSelectionStart, origSelectionEnd;
                    if (isInput) {
                        // can just use the original source element for the selection and copy
                        target = elem;
                        origSelectionStart = elem.selectionStart;
                        origSelectionEnd = elem.selectionEnd;
                    } else {
                        // must use a temporary form element for the selection and copy
                        target = document.getElementById(targetId);
                    if (!target) {
                        var target = document.createElement("textarea");
                        target.style.display = "none";
                        target.id = targetId;
                        document.body.appendChild(target);
                    }
                    target.textContent = elem.textContent;
                    }
                    // select the content
                    var currentFocus = document.activeElement;
                    target.focus();
                    target.setSelectionRange(0, target.value.length);
    
                    // copy the selection
                    var succeed;
                    try {
                        succeed = document.execCommand("copy");
                    } catch(e) {
                        succeed = false;
                    }
                    // restore original focus
                    if (currentFocus && typeof currentFocus.focus === "function") {
                        currentFocus.focus();
                    }
                    //Places a Copy Success Message then removes it from DOM
                    if(succeed === document.execCommand("copy")){
                        $('.citationHolder').append('<div class="success">Citation Copy Successful</div>');
                        $('.success').fadeOut(3000, function(){
                            $(this).remove();
                        });
                    }
    
                    if (isInput) {
                        // restore prior selection
                        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
                    } else {
                    // clear temporary content
                    target.textContent = "";
                    }
                    return succeed;
                }
	});
}());

