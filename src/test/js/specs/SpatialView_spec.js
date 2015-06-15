describe('GDP.PROCESS_CLIENT.VIEW.SpatialView', function() {
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
		model = new GDP.PROCESS_CLIENT.model.Job();
		GDP.config = new GDP.model.Config({
			application : {
				endpoints : {
					geoserver : 'http://fakegeoserver.com'
				}
			},
			process : {
				processes : [
						{
						id : 'ALG1',
						name : 'NAME1',
						title : 'TITLE1',
						type : 'TYPE1'
					},
					{
						id : 'ALG2',
						name : 'NAME2',
						title : 'TITLE2',
						type : 'TYPE1'
					},
					{
						id : 'ALG3',
						name : 'NAME3',
						title : 'TITLE3',
						type : 'TYPE2'
					}
				]
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
		spyOn(GDP.PROCESS_CLIENT.view.SpatialView.prototype, '_createDrawPolygonControl');

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

		spyOn($.fn, 'fileupload');

		$('body').append('<div id="test-div"><div id="spatial-map"></div><input id="upload-shapefile-input" type="file" name="qqfile"></div>')


		testView = new GDP.PROCESS_CLIENT.view.SpatialView({
			model : model,
			template : templateSpy
		});
		spyOn(testView.map, 'addLayer');
	});

	afterEach(function() {
		$('#test-div').remove();
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

	it('Expects the file upload widget to be initialized', function() {
		expect($.fn.fileupload).toHaveBeenCalled();
		var arg = $.fn.fileupload.mostRecentCall.args[0];
		expect(arg.url).toMatch('uploadhandler');
	});

	// Couldn't figure out how to trigger a change event or set the file property, so testing the send and done
	// callbacks by grabbing them from the spy and executing.
	it('Expects the file upload send function to update the url with the selected file name', function() {
		var sendCallback = $.fn.fileupload.mostRecentCall.args[0].send;
		var data = {
			url : 'http://testfileuploader',
			files : [{
				name : 'test_file.zip'
			}]
		};
		sendCallback({}, data);
		expect(data.url).toMatch('&qqfile=test_file.zip');
	});

	it('Expects a successful fileupload to update the AOI feature list and to set the aoiName attribute', function() {
		var data = {
			result: $.parseXML('<Response><store>test_layer</store><workspace>upload</workspace><name>upload:test_layer</name><success>true</success></Response>')
		};
		var getDeferred = $.Deferred();
		spyOn(testView, 'getAvailableFeatures').andReturn(getDeferred);
		var doneCallback = $.fn.fileupload.mostRecentCall.args[0].done;

		doneCallback({}, data);
		expect(testView.getAvailableFeatures).toHaveBeenCalled();
		getDeferred.resolve();
		expect(testView.model.get('aoiName')).toEqual('upload:test_layer');
	});

	it('Expects a failed fileupload to show an alert with the error message', function() {
		var data = {
			result : $.parseXML('<Response><error>Process failed during execution Target layer upload:test_layer already exists in the catalog</error><success>false</success></Response>')
		};
		var getDeferred = $.Deferred();
		spyOn(testView, 'getAvailableFeatures').andReturn(getDeferred);
		spyOn(testView.alertView, 'show');
		var doneCallback = $.fn.fileupload.mostRecentCall.args[0].done;

		doneCallback({}, data);
		expect(testView.alertView.show).toHaveBeenCalled();
		expect(testView.alertView.show.mostRecentCall.args[1]).toMatch('Target layer upload:test_layer');
	});

	it('Expects a change to aoiName to callWFS to make a DescribeFeatureType request', function() {
		wfsDeferred.resolve();
		testView.model.set('aoiName', 'featureName');
		expect(callWFSSpy.calls.length).toBe(2);
		var callWfsArgs = callWFSSpy.mostRecentCall.args;
		expect(callWfsArgs[0].request).toEqual('DescribeFeatureType');
		expect(callWfsArgs[0].typename).toEqual('featureName');
	});

	it('Expects a change to aoiName which is using the draw namepsace to set the aoiAttribute', function() {
		wfsDeferred.resolve();
		testView.model.set('aoiName', testView._DRAW_FEATURE_NS +':featureName');
		expect(testView.model.get('aoiAttribute')).toEqual(testView._DRAW_FEATURE_ATTRIBUTE);
	});

	//TODO: Add tests to build DOM correctly from DescribeFeaturetype response when aoiName is changed

	it('Expects a change to aoiAttribute to callWFS to make GetFeature request', function() {
		wfsDeferred.resolve();
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