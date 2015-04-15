/*jslint browser: true*/
/*global sinon,Backbone,jasmine,expect,GDP,_*/
describe('GDP.ADVANCED.view.DataDetailsView', function() {
	var model,
	templateSpy,
	renderSpy,
	loggerSpy,
	server,
	testView,
	callWpsSpy,
	wpsDeferred,
	wps,
	url = 'http://cida.usgs.gov';

	beforeEach(function() {
		server = sinon.fakeServer.create();
		model = new GDP.ADVANCED.model.Job();

		wpsDeferred = $.Deferred();

		templateSpy = jasmine.createSpy('templateSpy');
		renderSpy = jasmine.createSpy('renderSpy');
		loggerSpy = jasmine.createSpyObj('logger', ['error']);
		callWpsSpy = jasmine.createSpy('callWpsSpy').andReturn(wpsDeferred);

		GDP.logger = loggerSpy;
		wps = {
			sendWpsExecuteRequest : callWpsSpy
		};

		testView = new GDP.ADVANCED.view.DataDetailsView({
			model : model,
			template : templateSpy,
			wps: wps
		});
		testView.render = renderSpy;
	});

	afterEach(function() {
		server.restore();
	});
	it('Expects changeUrl to change the model\'s dataSourceUrl property', function() {
		testView.changeUrl({ target : { value : url } });
		expect(testView.model.get('dataSourceUrl')).toEqual(url);
	});
	
	it('Expects selectVariables to change the model\'s dataSourceVariables property', function() {
		var options = [
			{
			text: '',
			value: '',
			selected: null
			},
			{
			text: 'Var One',
			value: 'var1',
			selected: 'selected'
			},
			{
			text: 'Var Two',
			value: 'var2',
			selected: ''
			}
		];
		
		//call the function with 0, 1, 2, and 3 options.
		_.each(_.range(options.length), function(numberOfOptions){
			var optionsToUse = _.first(options, numberOfOptions);
			testView.selectVariables({ target : {options: optionsToUse }});
			var selectedOptions= testView.model.get('dataSourceVariables');
			var expectedToActualPairs = _.zip(optionsToUse, selectedOptions.models);
			_.each(expectedToActualPairs, function(expectedToActual){
				var expected = expectedToActual[0],
					actual = expectedToActual[1].attributes;
				expect(expected).toEqual(actual);
			});
		});
	});
	
	it('Expects the WPS date range and variable processes to be called when the url changes', function() {
		testView.changeUrl({ target : { value : url } });
		expect(callWpsSpy.calls.length).toBe(2);
		var callWpsArgs = _.pluck(callWpsSpy.calls, 'args');
		
		//algorithm id is the argument at index 1
		var actualAlgorithmIds = _.pluck(callWpsArgs, 1);
		
		var expectedAlgorithmIds = [GDP.ADVANCED.view.DataDetailsView.VARIABLE_WPS_PROCESS_ID, GDP.ADVANCED.view.DataDetailsView.DATE_RANGE_WPS_PROCESS_ID];
		var noDifference = 0 === _.difference(actualAlgorithmIds, expectedAlgorithmIds).length
			&& 0 === _.difference(expectedAlgorithmIds, actualAlgorithmIds).length;
		expect(noDifference).toBe(true);
	});

});