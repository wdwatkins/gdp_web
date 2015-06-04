describe('GDP.LANDING.views.DataSetDialogView', function() {
	var getDeferred;
	var templateSpy;
	var testModel;
	var testView;

	var TEST_DATA = {
		abstrct : 'Abstract1',
		bounds : new OpenLayers.Bounds([1, 2, 3, 4]),
		identifier : 'ID1',
		title : 'Title1',
		dataSources : ['DS1', 'DS2'],
		contactInfo : {name : 'Name1'},
		datasetTimeRange : {start : 'now', end: 'then'},
		distributionInfo : {url : 'fakeserver.com'}
	};

	beforeEach(function() {
		$('body').append('<div class="modal"><div class="modal-dialog"><div class="modal-content"></div></div></div>');

		templateSpy = jasmine.createSpy('templateSpy');
		GDP.algorithms = {
			get : jasmine.createSpy('algorithmsGetSpy').andReturn({'ID1' : ['Alg1', 'Alg2']})
		};
		testModel = new GDP.LANDING.models.DataSetModel({
			identificationInfo : [],
			fileIdentifier : {
				CharacterString : {
					value : 'ID1'
				}
			}
		});
		testModel.set(TEST_DATA);

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

	it('Expects that the modal is initialized and rendered is called with the expected attributes', function() {
		expect($.fn.modal).toHaveBeenCalled();
		expect(testView.render).toHaveBeenCalled();
		expect(templateSpy).toHaveBeenCalled();
		var context = templateSpy.calls[0].args[0];
		expect(testView.render).toHaveBeenCalled();
		expect(context.abstrct).toEqual(TEST_DATA.abstrct);
		expect(context.dataSources).toEqual(TEST_DATA.dataSources);
		expect(context.algorithms).toEqual(['Alg1', 'Alg2']);
	});

	it('Expects removeDialog to hide the dialog and remove the view', function() {
		testView.removeDialog();
		expect($.fn.modal).toHaveBeenCalledWith('hide');
		expect(testView.remove).toHaveBeenCalled();
	});
});