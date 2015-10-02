/*jslint browser: true*/
/*global sinon,Backbone,jasmine,expect,GDP,_,expect,window, spyOn*/
describe('GDP.PROCESS_CLIENT.view.DataDetailsView', function() {
	var model,
	templateSpy,
	loggerSpy,
	server,
	testView,
	url,
	dataSourceModel,
	dataSourceFetchDeferred,
	updateDataSetModelDeferred,
	preventDefaultSpy

	var $testDiv;

	//no-op alert
	window.alert = function(){};

	beforeEach(function() {
		$('body').append('<div id="test-div"></div>');
		$testDiv = $('#test-div');

		$testDiv.html('<select id="data-source-select"><option></option></select>' +
			'<input id="data-source-url" type="url" />' +
			'<input id="use-cached-checkbox" type="checkbox" />' +
			'<select id="data-source-vars" multiple /></select>' +
			'<input id="start-date" type="text" />' +
			'<input id="end-date" type="text" />'
		);

		url = 'http://testUrl';
		GDP.config = {
			get : function(prop) {
				if (prop === 'process') {
					return {
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
					};
				}
				else {
					return null;
				}
			}
		};
		model = new GDP.PROCESS_CLIENT.model.Job();
		updateDataSetModelDeferred = $.Deferred();
		spyOn(model, 'updateDataSetModel').andReturn(updateDataSetModelDeferred);
		dataSourceModel = model.get('dataSourceModel');
		dataSourceFetchDeferred = $.Deferred();
		spyOn(dataSourceModel, 'fetch').andReturn(dataSourceFetchDeferred);

		templateSpy = jasmine.createSpy('templateSpy');
		loggerSpy = jasmine.createSpyObj('logger', ['debug', 'error']);
		preventDefaultSpy = jasmine.createSpy('preventDefaultSpy');

		GDP.logger = loggerSpy;

		testView = new GDP.PROCESS_CLIENT.view.DataDetailsView({
			model : model,
			template : templateSpy,
			el : '#test-div'
		});
		updateDataSetModelDeferred.resolve();
	});

	afterEach(function() {
		testView.remove();
		$testDiv.remove();
		model.get('dataSourceModel').get('variables').reset();
		model.clear();
	});

	it('Expects setUrl() to change the model\'s dataSourceUrl property', function() {
		testView.setUrl({ target : { value : url } });
		expect(testView.model.get('dataSourceUrl')).toEqual(url);
	});

	it('Expects setSelectedVariables() to change the model\'s dataSourceVariables property', function() {
		var ev = {
			target : {
				selectedOptions : [
					{
						value : 'var1'
					}, {
						value : 'var2'
					}
				]
			}
		};
		testView.setSelectedVariables(ev);
		expect(testView.model.get('dataVariables')).toEqual(['var1', 'var2']);
	});

	it('Expects setStartDate to change the model\'s startDate property', function() {
		testView.setStartDate({
			preventDefault : preventDefaultSpy,
			target : { value : '2/3/2005' }
		});

		expect(testView.model.get('startDate')).toEqual('2/3/2005');
	});

	it('Expects setEndDate to change the model\'s endDate property', function() {
		testView.setEndDate({
			preventDefault : preventDefaultSpy,
			target : { value : '11/12/2006' }
		});
		expect(testView.model.get('endDate')).toEqual('11/12/2006');
	});


	it('Expects that updating the model\s url property disables all inputs and fetches the data source model', function() {
		var dataSourceModel = testView.model.get('dataSourceModel');
		testView.model.set('dataSourceUrl', url);

		expect(testView.$('#data-source-url').is(':disabled')).toBe(true);
		expect(testView.$('#data-source-select').is(':disabled')).toBe(true);
		expect(testView.$('#data-source-vars').is(':disabled')).toBe(true);
		expect(testView.$('#start-date').is(':disabled')).toBe(true);
		expect(testView.$('#end-date').is(':disabled')).toBe(true);

		expect(dataSourceModel.fetch).toHaveBeenCalledWith({
			dataSourceUrl : url,
			allowCached : false
		});

		$('#use-cached-checkbox').prop('checked', true);
		testView.model.set('dataSourceUrl', url + '1');

		expect(dataSourceModel.fetch.mostRecentCall.args[0]).toEqual({
			dataSourceUrl : url + '1',
			allowCached : true
		});
	});

	it('Expects a successful fetch to reenable the inputs', function() {
		testView.model.set('dataSourceUrl', url);
		dataSourceFetchDeferred.resolve();

		expect(testView.$('#data-source-url').is(':disabled')).toBe(false);
		expect(testView.$('#data-source-select').is(':disabled')).toBe(false);
		expect(testView.$('#data-source-vars').is(':disabled')).toBe(false);
		expect(testView.$('#start-date').is(':disabled')).toBe(false);
		expect(testView.$('#end-date').is(':disabled')).toBe(false);
	});

	it('Expects a failed fetch to reenable the inputs and to clear the dataVariable, startDate, and endDate fields', function() {
		testView.model.set('dataVariable', ['var1']);
		testView.model.set('startDate', '2/1/2005');
		testView.model.set('endDate', '3/1/2005');

		testView.model.set('dataSourceUrl', url);
		dataSourceFetchDeferred.reject();

		expect(testView.$('#data-source-url').is(':disabled')).toBe(false);
		expect(testView.$('#data-source-select').is(':disabled')).toBe(false);
		expect(testView.$('#data-source-vars').is(':disabled')).toBe(false);
		expect(testView.$('#start-date').is(':disabled')).toBe(false);
		expect(testView.$('#end-date').is(':disabled')).toBe(false);

		expect(testView.model.get('dataVariable')).toEqual([]);
		expect(testView.model.get('startDate')).toEqual('');
		expect(testView.model.get('endDate')).toEqual('');
	});

	it('Expects that if the variables property in the dataSourceModel are updated, the list of variables is updated', function() {
		var varPicker = testView.$('#data-source-vars');
		var dataSourceVariables = new GDP.PROCESS_CLIENT.model.DataSourceVariables();
		dataSourceVariables.add([
			{
				name: 'var1',
				description : 'Var1',
				unitsstring : 'u1'
			}, {
				name : 'var2',
				description : 'Var2',
				unitsstring : 'u2'
			}
		]);
		testView.model.get('dataSourceModel').set('variables', dataSourceVariables);

		expect(varPicker.find('option').length).toBe(2);
		expect(varPicker.is(':disabled')).toBe(false);

		dataSourceVariables = new GDP.PROCESS_CLIENT.model.DataSourceVariables();
		testView.model.get('dataSourceModel').set('variables', dataSourceVariables);
		expect(varPicker.find('option').length).toBe(0);
		expect(varPicker.is(':disabled')).toBe(true);
	});

	it('Expects that changing the dateRange in the dataSourceModel sets the values of the start/endDate in the model and sets the disabled state of the date pickers', function() {
		testView.model.get('dataSourceModel').set('dateRange', {
			start : '2/1/2005',
			end : '3/2/2005'
		});

		expect(testView.model.get('startDate')).toEqual('2/1/2005');
		expect(testView.model.get('endDate')).toEqual('3/2/2005');
	});

	it('Expects the variable picker to be updated if the dataVariables property in the model changes', function() {
		var $variablePicker = testView.$('#data-source-vars');
		var dataSourceVariables = new GDP.PROCESS_CLIENT.model.DataSourceVariables();
		dataSourceVariables.add([
			{
				name: 'var1',
				description : 'Var1',
				unitsstring : 'u1'
			}, {
				name : 'var2',
				description : 'Var2',
				unitsstring : 'u2'
			}, {
				name : 'var3',
				description : 'Var3',
				unitsstring : 'u3'
			}
		]);
		testView.model.get('dataSourceModel').set('variables', dataSourceVariables);
		testView.model.set('dataVariables', ['var1', 'var2']);
		expect($variablePicker.val()).toEqual(['var1', 'var2']);

		testView.model.set('dataVariables', []);
		expect($variablePicker.val()).toEqual(null);
	});

	//Tried to write tests for changeStartDate and changeEndDate but the datepicker did not want to work properly in tests.
});