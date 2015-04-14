/*jslint browser: true*/
/*global _*/
/*global $*/
/*global GDP.util.BaseView*/
/*global GDP.util.SelectMenuView*/
/*global GDP.OGC.WFS*/

var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.view = GDP.ADVANCED.view || {};


GDP.ADVANCED.view.SpatialView = GDP.util.BaseView.extend({

	events : {
		'change #select-aoi' : 'changeName',
		'change #select-attribute' : 'changeAttribute',
		'change #select-values' : 'changeValues'
	},

	initialize : function(options) {
		"use strict";

		GDP.util.BaseView.prototype.initialize.apply(this, arguments);

		this.nameSelectMenuView = new GDP.util.SelectMenuView({
			el : '#select-aoi',
			emptyPlaceholder : true,
			sortOptions: true
		});
		this.attributeSelectMenuView = new GDP.util.SelectMenuView({
			el : '#select-attribute',
			emptyPlaceholder : true,
			sortOptions: true
		});
		this.attributeValuesSelectMenuView = new GDP.util.SelectMenuView({
			el : '#select-values',
			emptyPlaceholder : true,
			sortOptions: true
		});

		this.getAvailableFeatures().then(
			function() {
				return;
			},
			function() {
				GDP.logger.error('GDP.view.SpatialView getAvailableFeatures failed');
			}
		);
		this.listenTo(this.model, 'change:aoiName', this.updateAttributes);
		this.listenTo(this.model, 'change:aoiAttribute', this.updateValues);
	},

	getAvailableFeatures : function() {
		"use strict";

		var populateFeatureTypesSelectBox = _.bind(function(data) {
			var optionValues = [];
			this.nameSelectMenuView.$el.val(null);
			$(data).find('FeatureType').each(function() {
				optionValues.push($(this).find('Name').text());
			});
			this.nameSelectMenuView.updateMenuOptions(optionValues);
		}, this);

		return GDP.OGC.WFS.callWFS(
			{
				request : 'GetCapabilities'
			},
			false,
			populateFeatureTypesSelectBox
		);
	},

	changeName : function(ev) {
		"use strict";
		this.model.set('aoiName', ev.target.value);
	},

	changeAttribute : function(ev) {
		"use strict";
		this.model.set('aoiAttribute', ev.target.value);
	},

	changeValues : function(ev) {
		"use strict";
		var aoiAttributeValues = _.pluck(ev.target.selectedOptions, 'value');
		this.model.set('aoiAttributeValues', aoiAttributeValues);
	},

	updateAttributes : function() {
		"use strict";
		var name = this.model.get('aoiName');

		this.attributeSelectMenuView.$el.val(null);
		this.attributeSelectMenuView.updateMenuOptions([]);
		this.model.set('aoiAttribute', '');

		if (name) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'DescribeFeatureType',
					typename : name
				},
				false,
				_.bind(function(data) {
					var optionValues = [];

					$(data).find('complexContent').find('element[name!="the_geom"]').each(function() {
						optionValues.push($(this).attr('name'));
					});
					this.attributeSelectMenuView.updateMenuOptions(optionValues);
				}, this)
			);
		}
	},

	updateValues : function() {
		"use strict";
		var attribute = this.model.get('aoiAttribute');
		var name = this.model.get('aoiName');

		this.model.set('aoiAttributeValues', []);
		this.attributeValuesSelectMenuView.$el.val(null);
		this.attributeValuesSelectMenuView.updateMenuOptions([]);

		if ((name) && (attribute)) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'GetFeature',
					typename : name,
					propertyname : attribute,
					maxFeatures : 5001 //TODO verify that this is correct
				},
				false,
				_.bind(function(data) {
					var optionValues = [];

					$(data).find(attribute).each(function() {
						// Don't repeat values in the list
						var value = $(this).text();
						if (_.indexOf(optionValues, value) === -1) {
							optionValues.push(value);
						}
					});
					this.attributeValuesSelectMenuView.updateMenuOptions(optionValues);
				}, this)
			);
		}
	}


});


