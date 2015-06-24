/*global GDP*/
/*global jasmine*/
/*global expect*/

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

		GDP.algorithms = {
			get : jasmine.createSpy('algorithmsGetSpy').andReturn({'1234' : ['Alg1', 'Alg2']})
		};
		templateSpy = jasmine.createSpy('templateSpy');
		GDP.LANDING.templates = {
			getTemplate : jasmine.createSpy('getTemplateSpy').andReturn(templateSpy)
		};
		collection = new GDP.models.DataSetCollection();
		spyOn(GDP.LANDING.views.DataSetTileView.prototype, 'initialize');
		spyOn(GDP.LANDING.views.DataSetTileView.prototype, 'setVisibility');

		GDP.logger = {
			debug : jasmine.createSpy('debugSpy')
		};

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


	});

	afterEach(function() {
		$('.dataset-tile-container').remove();
	});

	it('Expects the template to be called with an empty aoiMessageContext property if no incomingParams defined', function() {
		GDP.incomingParams = {};
		testView = new GDP.LANDING.views.DataSourceSelectionView({
			template : templateSpy,
			collection : collection
		});

		expect(templateSpy.calls[0].args[0].aoiMessageContext).toEqual({});
	});

	it('Expects the template to be called with aoiMessageContext property set to an object with a sciencebase property when caller param is sciencebase', function() {
		GDP.incomingParams = {
			caller : 'sciencebase',
			item_id : '1234',
			redirect_url : 'http://www.sciencebase.gov/catalog/gdp/1234'
		};
		testView = new GDP.LANDING.views.DataSourceSelectionView({
			template : templateSpy,
			collection : collection
		});
		expect(templateSpy.calls[0].args[0].aoiMessageContext).toEqual({
			sciencebase : {
				url : 'http://www.sciencebase.gov/catalog/item/1234'
			}
		});
	});

	it('Expects the template to be called with aoimessageContext property set with a default property when called param is not sciencebase', function() {
		GDP.incomingParams = {
			caller : 'otherservice',
			item_id : '1234'
		};
		testView = new GDP.LANDING.views.DataSourceSelectionView({
			template : templateSpy,
			collection : collection
		});
		expect(templateSpy.calls[0].args[0].aoiMessageContext).toEqual({
			default : {
				itemId : '1234',
				caller : 'otherservice'
			}
		});
	});

	describe('Tests for getRecords request processing', function() {
		beforeEach(function() {
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
				algorithms : [],
				title : 'Title1',
				dataSources : [],
				contactInfo : [],
				datasetTimeRange : null,
				distributionInfo : null
			});
			expect(GDP.LANDING.views.DataSetTileView.prototype.initialize.calls.length).toBe(3);
			expect(GDP.LANDING.views.DataSetTileView.prototype.initialize.calls[0].args[0].model).toEqual(testView.collection.first());
			expect(testView.dataSetViews.length).toBe(3);
		});

		it('Expects a failed getRecords call to create no models or views', function() {
			getDeferred.reject('Unavailable');
			expect(testView.collection.size()).toBe(0);
			expect(GDP.LANDING.views.DataSetTileView.prototype.initialize).not.toHaveBeenCalled();
			expect(testView.dataSetViews.length).toBe(0);
		});
	});

	describe('Tests for filterBy* methods', function() {

		beforeEach(function() {
			testView = new GDP.LANDING.views.DataSourceSelectionView({
				template : templateSpy,
				collection : collection
			});

			spyOn(GDP.models.DataSetModel.prototype, 'isInFilter');

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

		it('Expects a call to filterByText to update the text filter and call isInFilter for each model in the collection', function() {
			testView.filterByText({target : {value : 'This'}});

			expect(GDP.models.DataSetModel.prototype.isInFilter.calls.length).toBe(3);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[0].args[0].text).toEqual('This');
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[1].args[0].text).toEqual('This');
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[2].args[0].text).toEqual('This');

			testView.filterByText({target : {value : ''}});
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls.length).toBe(6);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[3].args[0].text).toEqual('');
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[4].args[0].text).toEqual('');
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[5].args[0].text).toEqual('');
		});

		it('Expects a call to filterByAlgorithm to update the algorithms call and call isInFilter for each model in the collection', function() {
			testView.filterByAlgorithm({target : {checked : true, value : 'TYPE1'}});

			expect(GDP.models.DataSetModel.prototype.isInFilter.calls.length).toBe(3);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[0].args[0].algorithms).toEqual(['ALG1', 'ALG2']);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[1].args[0].algorithms).toEqual(['ALG1', 'ALG2']);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[2].args[0].algorithms).toEqual(['ALG1', 'ALG2']);

			testView.filterByAlgorithm({target : {checked : true, value : 'TYPE2'}});

			expect(GDP.models.DataSetModel.prototype.isInFilter.calls.length).toBe(6);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[3].args[0].algorithms).toEqual(['ALG1', 'ALG2', 'ALG3']);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[4].args[0].algorithms).toEqual(['ALG1', 'ALG2', 'ALG3']);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[5].args[0].algorithms).toEqual(['ALG1', 'ALG2', 'ALG3']);

			testView.filterByAlgorithm({target : {checked : false, value : 'TYPE1'}});
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls.length).toBe(9);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[6].args[0].algorithms).toEqual(['ALG3']);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[7].args[0].algorithms).toEqual(['ALG3']);
			expect(GDP.models.DataSetModel.prototype.isInFilter.calls[8].args[0].algorithms).toEqual(['ALG3']);
		});

	});

});