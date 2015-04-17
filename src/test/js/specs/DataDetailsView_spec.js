/*jslint browser: true*/
/*global sinon,Backbone,jasmine,expect,GDP,_,expect,window*/
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
	
	//no-op alert
	window.alert = function(){};

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
	var resolveWithResponse = function(response){
		return function(){
			var deferred = $.Deferred();
			deferred.resolve(response);
			return deferred.promise();
		};
	};
	var rejectWithErrorMessage = function(message){
		return function(){
			var deferred = $.Deferred();
			deferred.reject(null, null, message);
			return deferred.promise();
		};
	};
	it('should reject the getDateRange promise with an error message if the web service call fails', function(){
		var expectedErrorMessage = 'error message';
		testView.wps.sendWpsExecuteRequest = rejectWithErrorMessage(expectedErrorMessage);
		var promise, actualErrorMessage;
		runs(function(){
			promise = testView.getDateRange('mockUrl', 'mockVariableName').fail(function(myMessage){
				actualErrorMessage = myMessage;
			});
		});
		waitsFor(function(){
			return 'pending' !== promise.state();
		});
		runs(function(){
			expect(actualErrorMessage).toBe(expectedErrorMessage);
		});
	});
	it('hasExpectedNumericProperties should return true if an object has all expected properties and all the corresponding values are numeric, and false otherwise', function(){
		var expectedProperties = ['a', 'b'];
		var failingValues = [
			//not an object
			null,
			
			//empty object
			{},
			
			//object with only a some of the expected properties
			{
				'a': null,
				'c': null
			},
			//object with all expected properties, but no values are numeric
			{
				'a': 'not a num',
				'b': [],
				'c': {}
			}
		],
		
		//object with all expected properties and all numeric values
		passingValue = {
			'a': 42,
			'b': 3.14159,
			'c': {}
		};
		_.each(failingValues, function(failingValue){
			expect(testView.hasExpectedNumericProperties(failingValue, expectedProperties)).toBe(false);
		});
		expect(testView.hasExpectedNumericProperties(passingValue, expectedProperties)).toBe(true);
	});
	it('isValidDateRangeResponse should return true if a response is a valid date range response, and false otherwise', function(){
		var unparseableResponses = [
			null,
			undefined,
			false,
			200,
			'',
			{},
			{availabletimes:null},
			{
				availabletimes:{
					starttime: null
				}
			},
			{
				availabletimes:{
					starttime: null,
					endtime: null
				}
			},
			{
				availabletimes:{
					endtime: null
				}
			}
		];
		_.each(unparseableResponses, function(unparseableResponse){
			expect(testView.isValidDateRangeResponse(unparseableResponse)).toBe(false);
		});
	});
	it('should reject the getDateRange promise with an error message if the web service call succeeds, but delivers an unparseable response', function(){
		var promise, returnedMessage;
		
		//mocks
		testView.isValidDateRangeResponse = function(){return false;};
		testView.wps.sendWpsExecuteRequest = resolveWithResponse(null);
		
		runs(function(){
			promise = testView.getDateRange('mockUrl', 'mockVariableName').fail(function(myMessage){
				returnedMessage = myMessage;
			});
		});
		waitsFor(function(){
			return 'pending' !== promise.state();
		});
		runs(function(){
			expect(returnedMessage).toBe(testView.failedToParseDateRangeResponseMessage);
		});
	});
	
	it('should resolve the getDateRange promise with no arguments if the web service call succeeds with a parseable response', function(){
		
		var parseableResponse = {
			availabletimes: {
				time : ['2001-01-01T12:00:00.000Z', '2001-01-02T12:00:00.000Z'],
				starttime: {
					year: 2001,
					month: 1,
					day: 1
				},
				endtime: {
					year: 2001,
					month: 1,
					day: 2
				}
			}
		};
		
		var promise,
		returnedResponse = 'something'; //if successful, this should be set to undefined
		testView.wps.sendWpsExecuteRequest = resolveWithResponse(parseableResponse);
		runs(function(){
			promise = testView.getDateRange('mockUrl', 'mockVariableName').done(function(myResponse){
				returnedResponse = myResponse;
			});
		});
		waitsFor(function(){
			return 'pending' !== promise.state();
		});
		runs(function(){
			expect(returnedResponse).toBeUndefined();
		});
	});
});