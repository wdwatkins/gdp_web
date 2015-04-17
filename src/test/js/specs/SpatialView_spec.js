describe('GDP.ADVANCED.VIEW.SpatialView', function() {
	var model;
	var templateSpy;
	var loggerSpy;
	var server;
	var testView;
	var callWFSSpy;
	var getBoundsSpy;
	var wfsDeferred;

	beforeEach(function() {
		server = sinon.fakeServer.create();
		model = new Backbone.Model({
			aoiName : '',
			aoiAttribute : '',
			aoiAttributeValues : []
		});
		GDP.config = new GDP.model.Config({
			application : {
				endpoints : {
					geoserver : 'http://fakegeoserver.com'
				}
			},
			map : {
				extent : {
					conus : {
						'3857' : [-14819398.304233, -92644.611414691, -6718296.2995848, 9632591.3700111]
					}
				}
			}
		});

		wfsDeferred = $.Deferred();

		spyOn(OpenLayers.Layer, 'WMS');
		templateSpy = jasmine.createSpy('templateSpy');
		loggerSpy = jasmine.createSpyObj('logger', ['error']);
		callWFSSpy = jasmine.createSpy('callWFSSpy').andReturn(wfsDeferred);
		getBoundsSpy = jasmine.createSpy('getBoundsSpy').andReturn(new OpenLayers.Bounds(-100.0, 22.2, -80.5, 45.5));

		GDP.logger = loggerSpy;
		GDP.OGC = {
			WFS : {
				callWFS : callWFSSpy,
				getBoundsFromCache : getBoundsSpy
			}
		};

		$('body').append('<div id="spatial-map"></div>')

		testView = new GDP.ADVANCED.view.SpatialView({
			model : model,
			template : templateSpy
		});
		spyOn(testView.map, 'addLayer');
	});

	afterEach(function() {
		$('#spatial-map').remove();
		server.restore();
	});

	it('Expects WFS call to be made when the view is initialized', function() {
		expect(callWFSSpy).toHaveBeenCalled();
		var callWfsArgs = callWFSSpy.mostRecentCall.args;
		expect(callWfsArgs[0].request).toEqual('GetCapabilities');
	});

	//TODO: Add tests to build DOM correctly from GetCapabilities response

	it('Expects a failed WFS call to log a message', function() {
		expect(loggerSpy.error).not.toHaveBeenCalled();
		wfsDeferred.reject();
		expect(loggerSpy.error).toHaveBeenCalled();
	});

	it('Expects a change to aoiName to callWFS to make a DescribeFeatureType request', function() {
		testView.model.set('aoiName', 'featureName');
		expect(callWFSSpy.calls.length).toBe(2);
		var callWfsArgs = callWFSSpy.mostRecentCall.args;
		expect(callWfsArgs[0].request).toEqual('DescribeFeatureType');
		expect(callWfsArgs[0].typename).toEqual('featureName');
	});

	//TODO: Add tests to build DOM correctly from DescribeFeaturetype response when aoiName is changed

	it('Expects a change to aoiAttribute to callWFS to make GetFeature request', function() {
		testView.model.set('aoiName', 'featureName');
		testView.model.set('aoiAttribute', 'attr1');

		expect(callWFSSpy.calls.length).toBe(3);

		var callWfsArgs = callWFSSpy.mostRecentCall.args;
		expect(callWfsArgs[0].request).toEqual('GetFeature');
		expect(callWfsArgs[0].typename).toEqual('featureName');
		expect(callWfsArgs[0].propertyname).toEqual('attr1');
	});

	//TODO: Add tests to build DOM correctly from GetFeature response when aoiAttribute is changed

	it('Expects changeName to change the model\'s aoiName property', function() {
		testView.changeName({ target : { value : 'thisFeature' } });
		expect(testView.model.get('aoiName')).toEqual('thisFeature');
	});

	it('Expects changeAttribute to change the model\'s aoiAttribute property', function() {
		testView.changeAttribute({ target : { value : 'thisAttribute' } });
		expect(testView.model.get('aoiAttribute')).toEqual('thisAttribute');
	});

	it('Expects changeValues to change the model\'s aoiValues property', function() {
		testView.changeValues({ target : { selectedOptions : [ { text : '1' }, { text : '2' }, { text : '3' } ] } });
		expect(testView.model.get('aoiAttributeValues')).toEqual(['1', '2', '3']);
	});
});