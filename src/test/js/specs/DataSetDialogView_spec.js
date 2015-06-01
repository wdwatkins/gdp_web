describe('GDP.LANDING.views.DataSetDialogView', function() {
	var getDeferred;
	var templateSpy;
	var testModel;
	var testView;

	beforeEach(function() {
		$('body').append('<div class="modal"><div class="modal-dialog"><div class="modal-content"></div></div></div>');

		getDeferred = $.Deferred();
		GDP.cswClient = {
			requestGetRecordById : jasmine.createSpy('requestGetRecordByIdSpy').andReturn(getDeferred)
		};

		templateSpy = jasmine.createSpy('templateSpy');

		testModel = new GDP.LANDING.models.DataSetModel({
			csw : {
				abstrct : 'Abstract1',
				bounds : new OpenLayers.Bounds([1, 2, 3, 4]),
				identifier : 'ID1',
				modified : 'yes',
				subject : 'Subject1',
				title : 'Title1',
				type : 'value1'
			},
			isoMetadata : {}
		});

		spyOn(testModel, 'getDataSources').andReturn(['DS1', 'DS2']);
		spyOn(testModel, 'getContactInfo').andReturn({name : 'Name1'});
		spyOn(testModel, 'getDataSetTimeRange').andReturn({start : 'now', end: 'then'});
		spyOn(testModel, 'getDistributionTransferOptions').andReturn({url : 'fakeserver.com'});
		spyOn(testModel, 'set').andCallThrough();

		GDP.algorithms = {
			get : jasmine.createSpy('getSpy').andReturn({ID1 : ['L1', 'L2']}, {ID2 : ['l3']})
		};
		GDP.logger = {
			error : jasmine.createSpy('logErrorSpy')
		};

		spyOn($.fn, 'modal');

		spyOn(GDP.LANDING.views.DataSetDialogView.prototype, 'render').andCallThrough();
		testView = new GDP.LANDING.views.DataSetDialogView({
			template : templateSpy,
			model : testModel,
			el : $('.modal')
		});
		spyOn(testView, 'remove');
	});

	afterEach(function() {
		$('.modal').remove();
	});

	it('Expects that a call to GetRecordById is made', function() {
		expect(GDP.cswClient.requestGetRecordById).toHaveBeenCalled();
		expect(GDP.cswClient.requestGetRecordById.calls[0].args[0].id).toEqual('ID1');
	});

	it('Expects that the modal is initialized before GetRecordBydId is resolved', function() {
		expect($.fn.modal).toHaveBeenCalled();
	});

	it('Expects that when GetRecordById is resolved, the model is updated and rendered is called', function() {
		expect(testView.render).not.toHaveBeenCalled();
		getDeferred.resolve({
			records : [{fake_data : 'Fake data'}, {fake_data : 'Fake data2'}]
		});
		expect(testModel.attributes.isoMetadata).toEqual({fake_data : 'Fake data'});
		expect(testView.render).toHaveBeenCalled();
	});

	it('Expects template to be rendered  with the information returned from the model after a successful GetRecordById', function() {
		var context;
		getDeferred.resolve({
			records : [{fake_data : 'Fake data'}, {fake_data : 'Fake data2'}]
		});
		expect(templateSpy).toHaveBeenCalled();
		context = templateSpy.calls[0].args[0];
		expect(context.dataSources).toEqual(['DS1', 'DS2']);
		expect(context.contactInfo).toEqual({name : 'Name1'});
		expect(context.identifier).toEqual('ID1');
		expect(context.algorithms).toEqual(['L1', 'L2']);
		expect(context.timeRange).toEqual({start : 'now', end: 'then'});
		expect(context.distributionInfo).toEqual({url : 'fakeserver.com'});
	});

	it('Expects a failed GetRecordById call to not render the view or update the model', function() {
		getDeferred.reject('Unavailable');
		expect(testView.render).not.toHaveBeenCalled();
		expect(testModel.set).not.toHaveBeenCalled();
	});

	it('Expects removeDialog to hide the dialog and remove the view', function() {
		testView.removeDialog();
		expect($.fn.modal).toHaveBeenCalledWith('hide');
		expect(testView.remove).toHaveBeenCalled();
	});
});