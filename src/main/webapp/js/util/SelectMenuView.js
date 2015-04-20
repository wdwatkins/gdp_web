/*global Backbone*/
/*global Handlebars*/
/*global $*/

var GDP = GDP || {};

GDP.util = GDP.util || {};

GDP.util.SelectMenuView = Backbone.View.extend({

	render : function() {
		"use strict";
		if (this.emptyPlaceholder) {
			this.$el.find('option').not(':first-child').remove();
		}
		else {
			this.$el.find('option').remove();
		}
		this.$el.append(this.template({options : this.menuOptions}));
		return this;
	},

	initialize : function(options) {
		"use strict";

		this.emptyPlaceholder = options.emptyPlaceholder ? options.emptyPlaceholder : false;
		this.sortOptions = options.sortOptions ? options.sortOptions : false;
		this.menuOptions = options.menuOptions ? options.menuOptions : [];

		this.$el = $(options.el);
		this.template = Handlebars.compile('{{#each options}}<option value={{value}}>{{text}}</option>{{/each}}');
		this.updateMenuOptions(this.menuOptions);
	},

	updateMenuOptions : function(newOptions) {
		"use strict";
		
		this.menuOptions = newOptions;
		if (this.sortOptions) {
			this.menuOptions.sort();
		}
		this.render();
	}
});


