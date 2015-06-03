describe('GDP.LANDING.views.DataSourceSelectionView', function() {
	var getDeferred;
	var templateSpy;
	var collection;
	var testView;

	beforeEach(function() {
		$('body').append('<div class="dataset-tile-container"></div>');
		getDeferred = $.Deferred();
		GDP.cswClient = {
			requestGetRecords : jasmine.createSpy('requestGetRecordsSpy').andReturn(getDeferred.promise())
		};

		templateSpy = jasmine.createSpy('templateSpy');
		GDP.LANDING.templates = {
			getTemplate : jasmine.createSpy('getTemplateSpy').andReturn(templateSpy)
		};
		collection = new GDP.LANDING.models.DataSetCollection();
		spyOn(GDP.LANDING.views.DataSetTileView.prototype, 'initialize');
		spyOn(GDP.LANDING.views.DataSetTileView.prototype, 'setVisibility');

		GDP.logger = {
			debug : jasmine.createSpy('debugSpy')
		};

		testView = new GDP.LANDING.views.DataSourceSelectionView({
			template : templateSpy,
			collection : collection
		});
	});

	afterEach(function() {
		$('.dataset-tile-container').remove();
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
		expect(GDP.LANDING.views.DataSetTileView.prototype.initialize.calls.length).toBe(3);
		expect(GDP.LANDING.views.DataSetTileView.prototype.initialize.calls[0].args[0].model).toEqual(testView.collection.first())
		expect(testView.dataSetViews.length).toBe(3);
	});

	it('Expects a failed getRecords call to create no models or views', function() {
		getDeferred.reject('Unavailable');
		expect(testView.collection.size()).toBe(0);
		expect(GDP.LANDING.views.DataSetTileView.prototype.initialize).not.toHaveBeenCalled();
		expect(testView.dataSetViews.length).toBe(0);
	});

	describe('Tests for filterByText', function() {

		beforeEach(function() {
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
		});

		it('Expects a calling filterByText with an empty value to call setVisibility on each dataSetView', function() {
			testView.filterByText({target : {value : ''}});
			expect(GDP.LANDING.views.DataSetTileView.prototype.setVisibility).toHaveBeenCalled();
			expect(GDP.LANDING.views.DataSetTileView.prototype.setVisibility.calls.length).toBe(3);
			_.each(GDP.LANDING.views.DataSetTileView.prototype.setVisibility.calls, function(call) {
				expect(call.args[0]).toBe(true);
			});
		});

		it('Expects a call to filterByText with a value to call setVisibility with true on views where the model\'s title or abstract contains the value', function() {
			testView.filterByText({target : {value : 'Title1'}});
			var calls = GDP.LANDING.views.DataSetTileView.prototype.setVisibility.calls;
			expect(calls.length).toBe(3);
			expect(calls[0].args[0]).toBe(true);
			expect(calls[1].args[0]).toBe(false);
			expect(calls[2].args[0]).toBe(false);

			testView.filterByText({target : {value : 'Abstract2'}});
			calls = GDP.LANDING.views.DataSetTileView.prototype.setVisibility.calls;
			expect(calls[3].args[0]).toBe(false);
			expect(calls[4].args[0]).toBe(true);
			expect(calls[5].args[0]).toBe(false);

			testView.filterByText({target: {value : 'ID'}});
			calls = GDP.LANDING.views.DataSetTileView.prototype.setVisibility.calls;
			expect(calls[6].args[0]).toBe(false);
			expect(calls[7].args[0]).toBe(false);
			expect(calls[8].args[0]).toBe(false);

			testView.filterByText({target : {value :'Title'}});
			calls = GDP.LANDING.views.DataSetTileView.prototype.setVisibility.calls;
			expect(calls[9].args[0]).toBe(true);
			expect(calls[10].args[0]).toBe(true);
			expect(calls[11].args[0]).toBe(true);
		});
	});

});