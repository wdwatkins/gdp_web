/*jslint browser: true*/
/*global sinon,Backbone,jasmine,expect,GDP,_,expect,window, spyOn*/
describe('GDP.PROCESS_CLIENT.view.DataDetailsView', function() {
	var model,
	templateSpy,
	renderSpy,
	loggerSpy,
	server,
	testView,
	url,
	dataSourceModel,
	dataSourceFetchDeferred,
	updateDataSetModelDeferred;

	//no-op alert
	window.alert = function(){};

	beforeEach(function() {
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
		loggerSpy = jasmine.createSpyObj('logger', ['error']);

		GDP.logger = loggerSpy;

		testView = new GDP.PROCESS_CLIENT.view.DataDetailsView({
			model : model,
			template : templateSpy,
		});
		updateDataSetModelDeferred.resolve();
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
});