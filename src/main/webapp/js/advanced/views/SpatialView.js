/*jslint browser: true*/
/*global _*/
/*global $*/
/*global OpenLayers*/
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
			this.map.zoomToExtent(new OpenLayers.Bounds(GDP.config.get('map').extent.conus['3857']), true);

			// Create selection menus
			this.nameSelectMenuView = new GDP.util.SelectMenuView({
				el : '#select-aoi',
				emptyPlaceholder : true,
				sortBy : 'text'
			});
			this.attributeSelectMenuView = new GDP.util.SelectMenuView({
				el : '#select-attribute',
				emptyPlaceholder : true,
				sortBy : 'text'
			});
			this.attributeValuesSelectMenuView = new GDP.util.SelectMenuView({
				el : '#select-values',
				emptyPlaceholder : true,
				sortBy : 'text'
			});
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
			this.highlightLayer = null;

			this.map = GDP.util.mapUtils.createMap(baseLayers, controls);

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);

			this.alertView = new GDP.util.AlertView({
				el : '#upload-messages-div'
			});

			// Set up file uploader
			var params = {
				maxfilesize : 167772160,
				'response.encoding' : 'xml',
				'filename.param' : 'qqfile',
				'use.crs.failover' : 'true',
				'projection.policy' : 'reproject'
			};

			$('#upload-shapefile-input').fileupload({
				url : 'uploadhandler?' +  $.param(params),
				type: 'POST',
				dataType: 'xml',
				send : function(e, data) {
					data.url = data.url + '&qqfile=' + data.files[0].name;
					$('#upload-indicator').show();
				},
				done : _.bind(function(e, data) {
					$('#upload-indicator').hide();

					var $resp = $(data.result);
					// Determine if the response indicated an error
					var success = $resp.find('success').first().text();
					if (success === 'true') {
						var warning = $resp.find('warning').first().text();
						var layer = $resp.find('name').first().text();

						if (warning) {
							this.alertView.show('alert-warning', 'Upload succeeded with warning' + warning);
						}
						else {
							this.alertView.show('alert-success', 'Upload was successful.');
						}

						this.getAvailableFeatures().then(
							_.bind(function() {
								$('#select-aoi').val(layer);
								this.model.set('aoiName', layer);
							}, this),
							_.bind(function() {
								this.alertView('alert-error', 'Unable to read uploaded shapefile attributes.');
							}, this)
						);
					}
					else {
						var error = $resp.find('error').first().text();
						var exception = $resp.find('exception').first().text();
						this.alertView.show('alert-danger', 'File Upload error: ' + error + '. ' + exception);
					}

				}, this),
				fail : _.bind(function(e, data) {
					$('#upload-indicator').hide();
					this.alertView.show('alert-error', 'Upload failed');
				}, this)
			});

			this.getAvailableFeatures().then(
				function() {
					return;
				},
				function() {
					GDP.logger.error('GDP.view.SpatialView getAvailableFeatures failed');
				}
			);

			// Initialize DOM
			var attribute = this.model.get('aoiAttribute');
			var values = this.model.get('aoiAttributeValues');
			this.updateSelectedAoiName();
			// Need to reset the aoiAttribute because updateSelectedAoiName clears it.
			if (attribute) {
				this.model.set('aoiAttribute', attribute);// Need to
				this.updateSelectedAoiAttribute();
			}
			// Need to reset the aoiAttributeValues because updateSelectedAOIAttribute clears it.
			if (values.length !== 0) {
				this.model.set('aoiAttributeValues', values);
				this.updateSelectedAoiAttributeValues();
			}

			this.listenTo(this.model, 'change:aoiName', this.updateSelectedAoiName);
			this.listenTo(this.model, 'change:aoiAttribute', this.updateSelectedAoiAttribute);
			this.listenTo(this.model, 'change:aoiAttributeValues', this.updateSelectedAoiAttributeValues);
		},

		getAvailableFeatures : function() {
			var populateFeatureTypesSelectBox = _.bind(function(data) {
				this.nameSelectMenuView.$el.val(null);
				var optionValues = _.map($(data).find('FeatureType'), function(el) {
					var text = $(el).find('Name').text();
					return {
						text : text,
						value : text
					};
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

		updateSelectedAoiName : function() {
			var name = this.model.get('aoiName');
			$('#select-aoi').val(name);
			this._updateAttributes(name);
			this._updateAOILayer(name);
		},

		updateSelectedAoiAttribute : function() {
			var name = this.model.get('aoiName');
			var attribute = this.model.get('aoiAttribute');
			$('#select-attribute').val(attribute);
			this._updateValues(name, attribute);
		},

		updateSelectedAoiAttributeValues : function() {
			var name = this.model.get('aoiName');
			var attribute = this.model.get('aoiAttribute');
			var values = this.model.get('aoiAttributeValues');

			$('#select-values').val(values);
			this._highlightFeatures(name, attribute, values);
		},

		changeName : function(ev) {
			this.model.set('aoiName', ev.target.value);
		},

		changeAttribute : function(ev) {
			this.model.set('aoiAttribute', ev.target.value);
		},

		changeValues : function(ev) {
			var aoiAttributeValues = _.pluck(ev.target.selectedOptions, 'text');
			this.model.set('aoiAttributeValues', aoiAttributeValues);
		},

		_updateAOILayer : function(name) {
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
							transparent : true
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
				// zoom map to extent of the feature.
				this.map.zoomToExtent(GDP.util.mapUtils.transformWGS84ToMercator(GDP.OGC.WFS.getBoundsFromCache(name)), true);
			}
			else if (this.aoiLayer) {
				this.map.removeLayer(this.aoiLayer);
				this.aoiLayer = null;
			}
		},

		_updateAttributes : function(name) {
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
						var $elements = $(data).find('complexContent').find('element[name!="the_geom"]');
						var optionValues = _.map($elements, function(el) {
							var name = $(el).attr('name');
							return {
								text : name,
								value: name
							};
						});

						this.attributeSelectMenuView.updateMenuOptions(optionValues);
					}, this)
				);
			}
		},

		_updateValues : function(name, attribute) {
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
						// Don't repeat values in the list
						var optionValues = _.uniq(
							_.map($(data).find(attribute), function(datum) {
								return $(datum).text();
							})
						);

						var optionObjects = _.map(optionValues, function(optionValue){
							return {
								text: optionValue,
								value: optionValue
							};
						});
						this.attributeValuesSelectMenuView.updateMenuOptions(optionObjects);
					}, this)
				);
			}
		},

		_highlightFeatures : function(name, attribute, values) {
			if ((name) && (attribute) && (values.length !== 0)) {
				values = _.map(values, function(v) {
					return '\'' + v + '\'';
				});
				var filter = attribute + ' IN (' + values.join(',') + ')';
				if (this.highlightLayer) {
					this.highlightLayer.mergeNewParams({
						layers : name,
						cql_filter : filter
					});
				}
				else {
					this.highlightLayer = new OpenLayers.Layer.WMS(
						"Selected AOI",
						GDP.config.get('application').endpoints.geoserver + '/wms?',
						{
							layers : name,
							transparent : true,
							styles : 'highlight',
							cql_filter : filter
						},
						{
							opacity: 0.6,
							displayInLayerSwitcher : false,
							visibility : true,
							isBaseLayer : false,
							singleTile : true
						}
					);
					this.map.addLayer(this.highlightLayer);
				}
			}
			else if (this.highlightLayer) {
				this.map.removeLayer(this.highlightLayer);
				this.highlightLayer = null;
			}
		}
	});
}());



