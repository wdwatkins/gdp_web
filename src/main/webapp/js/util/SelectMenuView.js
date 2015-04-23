/*global Backbone,_,Handlebars,$*/

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
		
		//'text', 'value', 'selected', or a custom function
		this.sortBy = options.sortBy ? options.sortBy : false;
		
		//true for ascending, false for descending
		this.sortAscending = _.isUndefined(options.sortAscending) ? true : options.sortAscending;
		this.menuOptions = options.menuOptions ? options.menuOptions : [];

		this.$el = $(options.el);
		this.template = Handlebars.compile('{{#each options}}<option value="{{value}}" {{#if selected}}selected{{/if}}>{{text}}</option>{{/each}}');
		this.updateMenuOptions(this.menuOptions);
	},

	updateMenuOptions : function(newOptions) {
		"use strict";
		this.menuOptions = newOptions;
		if (this.sortBy) {
			this.menuOptions = _.sortBy(this.menuOptions, this.sortBy);
			if(!this.sortAscending){
				this.menuOptions.reverse();
			}
		}
		this.render();
	}
});