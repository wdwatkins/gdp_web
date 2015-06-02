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
					identificationInfo : [
						{ abstract : {CharacterString : {value : 'Abstract1'}},
						citation : {title : {CharacterString : {value : 'Title1'}}}}
					],
					fileIdentifier : {CharacterString : {value :'ID1'}}

				}, {
					identificationInfo : [
						{ abstract : {CharacterString : {value : 'Abstract2'}},
						citation : {title : {CharacterString : {value : 'Title2'}}}}
					],
					fileIdentifier : {CharacterString : {value :'ID2'}}
				}, {
					identificationInfo : [
						{ abstract : {CharacterString : {value : 'Abstract3'}},
						citation : {title : {CharacterString : {value : 'Title3'}}}}
					],
					fileIdentifier : {CharacterString : {value :'ID3'}}
				}
			]
		};
		getDeferred.resolve(response);
		expect(testView.collection.size()).toBe(3);
		expect(testView.collection.first().attributes).toEqual({
			abstrct : 'Abstract1',
			bounds : '',
			identifier : 'ID1',
			title : 'Title1',
			dataSources : [],
			contactInfo : [],
			datasetTimeRange : null,
			distributionInfo : null
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