/*jslint browser: true*/
/*global Backbone*/
/*global _*/

var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.SpatialView = GDP.util.BaseView.extend({

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
		this.listenTo(this.model, 'change:name', this.updateAttributes);
		this.listenTo(this.model, 'change:attribute', this.updateValues);
	},

	getAvailableFeatures : function() {
		var populateFeatureTypesSelectBox = function(data) {
			var $select = $('#select-aoi');
			var options = '<option></option>';

			$select.html("");
			$(data).find('FeatureType').each(function() {
				var name = $(this).find('Name').text();
				options += '<option value="' + name + '">' + name + '</option>';
			});
			$('#select-aoi').append(options);
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
		this.model.set('name', ev.target.value);
	},

	changeAttribute : function(ev) {
		this.model.set('attribute', ev.target.value);
	},

	changeValues : function(ev) {
		var values = [];
		var i;
		for (i = 0; i < ev.target.selectedOptions.length; i++) {
			values.push(ev.target.selectedOptions[i].value);
		}
		this.model.set('values', values);
	},

	updateAttributes : function() {
		var name = this.model.get('name');
		this.model.set('attribute', '');
		if (name) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'DescribeFeatureType',
					typename : name
				},
				false,
				function(data) {
					var $select = $('#select-attribute');
					$select.val();
					var options = '<option></option>';

					$select.html();
					$(data).find('element[name!="the_geom"]').each(function() {
						var attribute = $(this).attr('name');
						options += '<option value="' + attribute +'">' + attribute + '</option>';
					});
					$select.append(options);
				}
			);
		}
	},

	updateValues : function() {
		var attribute = this.model.get('attribute');
		this.model.set('values', []);
		if (attribute) {
			GDP.OGC.WFS.callWFS(
				{
					request : 'GetFeature',
					typeName : this.model.get('name'),
					propertyName : attribute,
					maxFeatures : 5001 //TODO verify that this is correct
				},
				false,
				function(data) {
					var $select = $('#select-values');
					$select.val();
					var optValues = [];
					var options = '<option></option>';

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


