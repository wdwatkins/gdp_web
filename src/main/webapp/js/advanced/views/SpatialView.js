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
				GDP.logger.debug('GDP.view.SpatialView getAvailableFeatures failed');
			}
		);
		this.listenTo(this.model, 'change:aoiName', this.updateAttributes);
		this.listenTo(this.model, 'change:aoiAttribute', this.updateValues);
	},

	getAvailableFeatures : function() {
		var populateFeatureTypesSelectBox = function(data) {
			var $select = $('#select-aoi');
			var options = '';

			$select.find('option').not(':first-child').remove();
			$select.val(null);

			$(data).find('FeatureType').each(function() {
				var name = $(this).find('Name').text();
				options += '<option value="' + name + '">' + name + '</option>';
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
					var options = '';
					$(data).find('complexContent').find('element[name!="the_geom"]').each(function() {
						var attribute = $(this).attr('name');
						options += '<option value="' + attribute +'">' + attribute + '</option>';
					});
					$select.append(options);
				}
			);
		}
	},

	updateValues : function() {
		var attribute = this.model.get('aoiAttribute');
		var $select = $('#select-values');

		this.model.set('aoiAttributeValues', []);
		$select.find('option').not(':first-child').remove();
		$select.val();

		if (attribute) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'GetFeature',
					typeName : this.model.get('aoiName'),
					propertyName : attribute,
					maxFeatures : 5001 //TODO verify that this is correct
				},
				false,
				function(data) {
					var optValues = [];
					var options = '';

					$select.html();
					$(data).find(attribute).each(function() {
						var value = $(this).text();
						if (_.indexOf(optValues, value) === -1) {
							optValues.push(value);
							options += '<option value="' + value + '">' + value + '</option>';
						}
					});
					$select.append(options);
				}
			);
		}
	}


});


