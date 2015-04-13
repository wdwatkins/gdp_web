/*jslint browser: true*/
/*global Backbone*/
/*global _*/
/*global GDP.ADVANCED.model.Job */

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

		GDP.util.BaseView.prototype.initialize.apply(this, arguments);

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
		var populateFeatureTypesSelectBox = function(data) {
			var $select = $('#select-aoi');
			var optionValues = [];
			var options = '';

			$select.find('option').not(':first-child').remove();
			$select.val(null);

			$(data).find('FeatureType').each(function() {
				optionValues.push($(this).find('Name').text());
			});
			optionValues.sort();
			_.each(optionValues, function(v) {
				options += '<option value="' + v + '">' + v + '</option>';
			});
			$select.append(options);
		};

		return GDP.OGC.WFS.callWFS(
			{
				request : 'GetCapabilities'
			},
			false,
			populateFeatureTypesSelectBox
		);
	},

	changeName : function(ev) {
		this.model.set('aoiName', ev.target.value);
	},

	changeAttribute : function(ev) {
		this.model.set('aoiAttribute', ev.target.value);
	},

	changeValues : function(ev) {
		var aoiAttributeValues = _.pluck(ev.target.selectedOptions, 'value');
		this.model.set('aoiAttributeValues', aoiAttributeValues);
	},

	updateAttributes : function() {
		var name = this.model.get('aoiName');
		var $select = $('#select-attribute');

		$select.find('option').not(':first-child').remove();
		$select.val(null);

		this.model.set('aoiAttribute', '');
		if (name) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'DescribeFeatureType',
					typename : name
				},
				false,
				function(data) {
					var optionValues = [];
					var options = '';

					$(data).find('complexContent').find('element[name!="the_geom"]').each(function() {
						optionValues.push($(this).attr('name'));
					});
					optionValues.sort();
					_.each(optionValues, function(v) {
						options += '<option value="' + v +'">' + v+ '</option>';
					});
					$select.append(options);
				}
			);
		}
	},

	updateValues : function() {
		var attribute = this.model.get('aoiAttribute');
		var name = this.model.get('aoiName');
		var $select = $('#select-values');

		this.model.set('aoiAttributeValues', []);
		$select.find('option').not(':first-child').remove();
		$select.val();

		if ((name) || (attribute)) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'GetFeature',
					typename : this.model.get('aoiName'),
					propertyname : attribute,
					maxFeatures : 5001 //TODO verify that this is correct
				},
				false,
				function(data) {
					var optionValues = [];
					var options = '';

					$(data).find(attribute).each(function() {
						// Don't repeat values in the list
						var value = $(this).text();
						if (_.indexOf(optionValues, value) === -1) {
							optionValues.push(value);
						}
					});
					optionValues.sort();
					_.each(optionValues, function(v) {
						options += '<option value="' + v + '">' + v + '</option>';
					});
					$select.append(options);
				}
			);
		}
	}


});


