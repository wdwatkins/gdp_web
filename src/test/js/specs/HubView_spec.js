describe('GDP.PROCESS_CLIENT.view.HubView', function() {
	var model;
	var templateSpy, spatialViewRemoveSpy;
	var server;
	var testView;
	var datasetDeferred;

	beforeEach(function() {
		server = sinon.fakeServer.create();

		model = new GDP.PROCESS_CLIENT.model.Job();
		spyOn(model, "getSelectedAlgorithmProcess").andReturn(new Backbone.Model({'var1' : 'value1', 'var2' : 'value2'}));
		spyOn(model, 'jobErrorMessages').andReturn({
			spatial : [],
			dataDetails : [],
			algorithm : []
		});
		datasetDeferred = $.Deferred();
		spyOn(model, 'updateDataSetModel').andReturn(datasetDeferred.promise());
		datasetDeferred.resolve();
		templateSpy = jasmine.createSpy('templateSpy');

		spyOn(GDP.OGC, 'WPS').andReturn({});

		spatialViewRemoveSpy = jasmine.createSpy('spatialViewRemoveSpy');
		spyOn(GDP.PROCESS_CLIENT.view, 'HubSpatialMapView').andReturn({
			remove : spatialViewRemoveSpy
		});

		spyOn($, 'download');

		testView = new GDP.PROCESS_CLIENT.view.HubView({
			model : model,
			template : templateSpy
		});
	});

	afterEach(function() {
		server.restore();
	});

	it('Expects the view to create a spatial map view, an alert view, and a results model at initialization', function() {
		expect(testView.spatialMapView).toBeDefined();
		expect(testView.alertView).toBeDefined();
		expect(testView.resultsModel).toBeDefined();
	});

	it('Expects the template to be rendered at initialization', function() {
		expect(templateSpy).toHaveBeenCalled();
		expect(templateSpy.mostRecentCall.args[0].invalidJob).toEqual(false);
	});

	it('Expects the spatialMapView to be removed when remove is called', function() {
		testView.remove();
		expect(spatialViewRemoveSpy).toHaveBeenCalled();
	});

	it('Expects downloadResults to use filename in the data when defined in the model', function() {
		testView.resultsModel.set({
			outputURL : 'http://fakeservice',
			outputData : 'id=fakeid'
		});

		testView.downloadResults();
		expect($.download).toHaveBeenCalledWith('http://fakeservice', 'id=fakeid', 'get');

		testView.model.set('filename', 'my_file');
		testView.downloadResults();
		expect($.download.mostRecentCall.args).toEqual(['http://fakeservice', 'id=fakeid&filename=my_file', 'get']);
	});

	it('Expects downlaodProcessInputs to call the service with the statusId', function() {
		testView.resultsModel.set({
			outputURL : 'http://fakeservice',
			statusId : 'fakeStatusId'
		});
		testView.downloadProcessInputs();
		expect($.download).toHaveBeenCalled();
		expect($.download.calls[0].args[0]).toEqual('http://fakeservice');
		expect($.download.calls[0].args[1]).toMatch('id=fakeStatusId');
	});
});