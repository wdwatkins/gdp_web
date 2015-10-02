/*jslint browser: true */
/*global sinon */
/*global $*/
/*global jasmine */
/*global GDP */
/*global expect */

describe('DataSourceModels', function() {

	var server;

	beforeEach(function() {
		GDP.config.set('application', {
			endpoints : {
				utilityWPS : 'http://fakeUtilityWPS'
			}
		});
		server = sinon.fakeServer.create();
	});

	afterEach(function() {
		server.restore();
	});

	describe('DataSourceVariables collection', function() {

		var wpsDeferred;
		var testCollection;
		var successSpy, failedSpy;

		beforeEach(function() {
			wpsDeferred = $.Deferred();

			GDP.wpsClient = {
				sendWpsExecuteRequest : jasmine.createSpy().andReturn(wpsDeferred.promise())
			};

			successSpy = jasmine.createSpy('SuccessSpy');
			failedSpy = jasmine.createSpy('FailedSpy');

			testCollection = new GDP.PROCESS_CLIENT.model.DataSourceVariables();
		});

		it('Expects when fetch is called that a properly formated wps request is sent', function() {
			testCollection.fetch({
				dataSourceUrl : 'http://fakeDataSource',
				allowCached : true
			});

			expect(GDP.wpsClient.sendWpsExecuteRequest).toHaveBeenCalled();
			expect(GDP.wpsClient.sendWpsExecuteRequest.calls[0].args[2]).toEqual({
				'catalog-url' : ['http://fakeDataSource'],
				'allow-cached-response' : ['true']
			});

			testCollection.fetch({
				dataSourceUrl : 'http://fakeDataSource',
				allowCached : false
			});
			expect(GDP.wpsClient.sendWpsExecuteRequest.calls.length).toBe(2);
			expect(GDP.wpsClient.sendWpsExecuteRequest.calls[1].args[2]).toEqual({
				'catalog-url' : ['http://fakeDataSource'],
				'allow-cached-response' : ['false']
			});
		});
		it('Expects a successful response to resolve the promise returned by fetch', function() {
			var response = {
				datatypecollection : {
					types : [
						{
							name : 'Name1',
							description : 'Description1',
							unitsstring : 'Unit1'
						},{
							name : 'Name2',
							description : 'Description2',
							unitsstring : 'Unit2'
						},{
							name : 'Name3',
							description : 'Description3',
							unitsstring : 'Unit3'
						}
					]
				}
			};
			testCollection.fetch({
				dataSourceUrl : 'http://fakeDataSource',
				allowCached : false
			}).done(successSpy).fail(failedSpy);

			expect(successSpy).not.toHaveBeenCalled();
			expect(failedSpy).not.toHaveBeenCalled();

			wpsDeferred.resolve(response);
			expect(successSpy).toHaveBeenCalled();
			expect(failedSpy).not.toHaveBeenCalled();

			expect(testCollection.models.length).toBe(3);
			expect(testCollection.models[0].attributes).toEqual(response.datatypecollection.types[0]);
		});

		it('Expects a successful response with bad data to reject the promise', function() {
			var response = {
				t : 1,
				a : 2
			};

			testCollection.fetch({
				dataSourceUrl : 'http://fakeDataSource',
				allowCached : false
			}).done(successSpy).fail(failedSpy);

			wpsDeferred.resolve(response);
			expect(successSpy).not.toHaveBeenCalled();
			expect(failedSpy).toHaveBeenCalled();

			wpsDeferred = $.Deferred();
			testCollection.fetch({
				dataSourceUrl : 'http://fakeDataSource',
				allowCached : false
			}).done(successSpy).fail(failedSpy);

			response = {
				datatypecollection : {
					t : 1
				}
			};
			wpsDeferred.resolve(response);
			expect(successSpy).not.toHaveBeenCalled();
			expect(failedSpy.calls.length).toBe(2);
		});

		it('Expects a failed response to reject the promise', function() {
			testCollection.fetch({
				dataSourceUrl : 'http://fakeDataSource',
				allowCached : false
			}).done(successSpy).fail(failedSpy);

			wpsDeferred.reject();
			expect(successSpy).not.toHaveBeenCalled();
			expect(failedSpy).toHaveBeenCalled();
		});
	});

	describe('DataSourceModel tests', function() {
		var wpsDeferred;
		var testModel;
		var successSpy, failedSpy;

		beforeEach(function() {
			wpsDeferred = $.Deferred();
			successSpy = jasmine.createSpy('SuccessSpy');
			failedSpy = jasmine.createSpy('FailedSpy');

			GDP.wpsClient = {
				sendWpsExecuteRequest : jasmine.createSpy().andReturn(wpsDeferred.promise())
			};

			testModel = new GDP.PROCESS_CLIENT.model.DataSourceModel();
		});

		describe('DataSourceModel.getDateRange tests', function() {
			beforeEach(function() {
				testModel.set('url', 'http://fakeDataService');
				testModel.get('variables').add([
					{
						name : 'Name1',
						description : 'Description1',
						unitsstring : 'Unit1'
					},{
						name : 'Name2',
						description : 'Description2',
						unitsstring : 'Unit2'
					},{
						name : 'Name3',
						description : 'Description3',
						unitsstring : 'Unit3'
					}
				]);
			});

			it('Expects a call to getDateRange to setup the wps call properly', function() {
				testModel.getDateRange({allowCached : true});

				expect(GDP.wpsClient.sendWpsExecuteRequest).toHaveBeenCalled();
				expect(GDP.wpsClient.sendWpsExecuteRequest.calls[0].args[2]).toEqual({
					"catalog-url" : ['http://fakeDataService'],
					'allow-cached-response' : ['true'],
					'grid' : ['Name1']
				});

				testModel.getDateRange({allowCached : false});
				expect(GDP.wpsClient.sendWpsExecuteRequest.calls.length).toBe(2);
				expect(GDP.wpsClient.sendWpsExecuteRequest.calls[1].args[2]['allow-cached-response']).toEqual(['false']);
			});

			it('Expects a properly formatted response to update the model and resolve the promise', function() {
				var response = {
					availabletimes : {
						starttime : {
							year : 2001,
							month : 12,
							day : 15
						},
						endtime : {
							year : 2010,
							month : 2,
							day : 1
						}
					}
				};

				testModel.getDateRange({allowCached : true }).done(successSpy).fail(failedSpy);
				expect(successSpy).not.toHaveBeenCalled();
				expect(failedSpy).not.toHaveBeenCalled();

				wpsDeferred.resolve(response);
				expect(successSpy).toHaveBeenCalled();
				expect(failedSpy).not.toHaveBeenCalled();

				expect(testModel.get('dateRange')).toEqual({
					start : '12/15/2001',
					end : '2/1/2010'
				});
			});

			it('Expects a successful call with improperly formatted response to reject the promise', function() {
				var response = {
					a : 1
				};
				testModel.getDateRange({allowCached : true }).done(successSpy).fail(failedSpy);
				wpsDeferred.resolve(response);
				expect(successSpy).not.toHaveBeenCalled();
				expect(failedSpy).toHaveBeenCalled();

				var response = {
					availabletimes : {starttime : 1}
				};
				wpsDeferred = $.Deferred();
				testModel.getDateRange({allowCached : true }).done(successSpy).fail(failedSpy);
				wpsDeferred.resolve(response);
				expect(successSpy).not.toHaveBeenCalled();
				expect(failedSpy.calls.length).toBe(2);
			});

			it('Expects a failed WPS call to reject the promise', function() {
				testModel.getDateRange({allowCached : true }).done(successSpy).fail(failedSpy);
				wpsDeferred.reject('Failed message');
				expect(successSpy).not.toHaveBeenCalled();
				expect(failedSpy).toHaveBeenCalled();
			});
		});
	});
});