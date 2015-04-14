/*jslint browser: true*/
/*global _*/
/*global $*/
/*global GDP.util.BaseView*/
/*global GDP.util.SelectMenuView*/
/*global GDP.util.mapUtils*/
/*global GDP.OGC.WFS*/

var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.view = GDP.ADVANCED.view || {};


(function() {
	"use strict";
	GDP.ADVANCED.view.SpatialView = GDP.util.BaseView.extend({

		events : {
			'change #select-aoi' : 'changeName',
			'change #select-attribute' : 'changeAttribute',
			'change #select-values' : 'changeValues'
		},

		render : function() {
			GDP.util.BaseView.prototype.render.apply(this, arguments);
			this.map.render('spatial-map');
			this.map.zoomToExtent(this.map.getMaxExtent(), true);
		},

		initialize : function(options) {
			var baseLayers = [GDP.util.mapUtils.createWorldStreetMapLayer()];
			var controls = [
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.MousePosition({
					prefix: 'POS: ',
					numDigits: 2,
					displayProjection: GDP.util.mapUtils.WGS84_GEOGRAPHIC
				}),
				new OpenLayers.Control.ScaleLine({
					geodesic: true
				}),
				new OpenLayers.Control.Zoom()
			];
			this.aoiLayer = null;
			this.map = GDP.util.mapUtils.createMap(baseLayers, controls);

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
			this.updateAOILayer();
			this.listenTo(this.model, 'change:aoiName', this.updateAttributes);
			this.listenTo(this.model, 'change:aoiName', this.updateAOILayer);
			this.listenTo(this.model, 'change:aoiAttribute', this.updateValues);
		},

		getAvailableFeatures : function() {
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
			this.model.set('aoiName', ev.target.value);
		},

		changeAttribute : function(ev) {
			this.model.set('aoiAttribute', ev.target.value);
		},

		changeValues : function(ev) {
			var aoiAttributeValues = _.pluck(ev.target.selectedOptions, 'value');
			this.model.set('aoiAttributeValues', aoiAttributeValues);
		},

		updateAOILayer : function() {
			var name = this.model.get('aoiName');
			if (name) {
				if (this.aoiLayer) {
					this.aoiLayer.mergeNewParams({
						layers : name
					});
				}
				else {
					this.aoiLayer = new OpenLayers.Layer.WMS(
						"Area of Interest",
						GDP.config.get('application').endpoints.geoserver + '/wms?',
						{
							layers : name,
							transparent : true,
						},
						{
							opacity: 0.6,
							displayInLayerSwitcher : false,
							visibility : true,
							isBaseLayer : false
						}
					);
					this.map.addLayer(this.aoiLayer);
				}
			}
			else if (this.aoiLayer) {
				this.map.removeLayer(this.aoiLayer);
				this.aoiLayer = null;
			}
		},

		updateAttributes : function() {
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
}());



