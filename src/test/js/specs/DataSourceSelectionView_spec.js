describe('GDP.LANDING.views.DataSourceSelectionView', function() {
	var getDeferred;
	var templateSpy;
	var collection;
	var testView;

	beforeEach(function() {
		getDeferred = $.Deferred();
		GDP.cswClient = {
			requestGetRecords : jasmine.createSpy('requestGetRecordsSpy').andReturn(getDeferred.promise())
		};

		templateSpy = jasmine.createSpy('templateSpy');
		GDP.LANDING.templates = {
			getTemplate : jasmine.createSpy('getTemplateSpy').andReturn(templateSpy)
		};
		collection = new GDP.LANDING.models.DataSetCollection();
		spyOn(GDP.LANDING.views, 'DataSetTileView');

		GDP.logger = {
			debug : jasmine.createSpy('debugSpy')
		};

		testView = new GDP.LANDING.views.DataSourceSelectionView({
			template : templateSpy,
			collection : collection
		});
	});

	it('Expects that a getRecords request is made', function() {
		expect(GDP.cswClient.requestGetRecords).toHaveBeenCalled();
	});

	it('Expects a successful GetRecords request to create DataSetModels and dataSetViews for each record', function() {
		var response = {
			records : [
				{
					abstract : ['Abstract1'],
					bounds : {},
					identifier : [{value :'ID1'}],
					modified :['yes'],
					subject : 'Subject1',
					title : [{value : 'Title1'}],
					type : [{value : 'value1'}]
				}, {
					abstract : ['Abstract2'],
					bounds : {},
					identifier : [{value :'ID2'}],
					modified :['yes'],
					subject : 'Subject2',
					title : [{value : 'Title2'}],
					type : [{value : 'value2'}]
				}, {
				abstract : ['Abstract3'],
					bounds : {},
					identifier : [{value :'ID3'}],
					modified :['yes'],
					subject : 'Subject3',
					title : [{value : 'Title3'}],
					type : [{value : 'value3'}]
				}
			]
		};
		getDeferred.resolve(response);
		expect(testView.collection.size()).toBe(3);
		expect(testView.collection.first().attributes.csw).toEqual({
			abstrct : 'Abstract1',
			bounds : {},
			identifier : 'ID1',
			modified : 'yes',
			subject : 'Subject1',
			title : 'Title1',
			type : 'value1'
		});
		expect(GDP.LANDING.views.DataSetTileView.calls.length).toBe(3);
		expect(GDP.LANDING.views.DataSetTileView.calls[0].args[0].model).toEqual(testView.collection.first())
		expect(testView.dataSetViews.length).toBe(3);
	});

	it('Expects a failed getRecords call to create no models or views', function() {
		getDeferred.reject('Unavailable');
		expect(testView.collection.size()).toBe(0);
		expect(GDP.LANDING.views.DataSetTileView).not.toHaveBeenCalled();
		expect(testView.dataSetViews.length).toBe(0);
	});
});