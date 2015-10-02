/*global GDP*/
/*global expect*/
/*global jasmine*/

describe('GDP.models.DataSetModel', function() {

	var testModel;

	beforeEach(function() {
		GDP.algorithms = {
			get : jasmine.createSpy('algorithmsGetSpy').andReturn({'1234' : ['Alg1', 'Alg2']})
		};

		GDP.config = new GDP.model.Config({
			process : {
				processes : [
						{
						id : 'Alg1',
						name : 'NAME1',
						title : 'TITLE1',
						type : 'TYPE1'
					},
					{
						id : 'Alg2',
						name : 'NAME2',
						title : 'TITLE2',
						type : 'TYPE1'
					},
					{
						id : 'Alg3',
						name : 'NAME3',
						title : 'TITLE3',
						type : 'TYPE2'
					},
					{
						id : 'Alg4',
						name : 'NAME4',
						title : 'TITLE4',
						type : 'TYPE2'
					}
				]
			}
		});
	});

	it('If the dataset model is created with no metadata that all algorithms in the config\'s processes property are assigned to the algorithms property', function() {
		testModel = new GDP.models.DataSetModel();
		expect(testModel.get('algorithms')).toEqual([
				{
				id : 'Alg1',
				name : 'NAME1',
				title : 'TITLE1',
				type : 'TYPE1'
			},
			{
				id : 'Alg2',
				name : 'NAME2',
				title : 'TITLE2',
				type : 'TYPE1'
			},
			{
				id : 'Alg3',
				name : 'NAME3',
				title : 'TITLE3',
				type : 'TYPE2'
			},
			{
				id : 'Alg4',
				name : 'NAME4',
				title : 'TITLE4',
				type : 'TYPE2'
			}
		]);
	});

	describe('Tests for isInFilter function', function() {
		beforeEach(function(){
			testModel = new GDP.models.DataSetModel({
				identificationInfo : [],
				fileIdentifier : {
					CharacterString : {
						value : '1234'
					}
				}
			});
			testModel.set('abstrct', 'This is an Abstract');
			testModel.set('title', 'title of dataset');
		});

		it('Expects isInFilter to return true if no filters are specified', function() {
			expect(testModel.isInFilter({text : '', algorithms : []})).toBe(true);
			expect(testModel.isInFilter({})).toBe(true);
		});

		it('Expects isInFilter to return true if algorithm is in the algorithms filter', function() {
			expect(testModel.isInFilter({
				text : '',
				algorithms : ['Alg1', 'Alg3']
			})).toBe(true);
		});

		it('Expects isInFilter to return false if algorith is not in the algorithms filter', function() {
			expect(testModel.isInFilter({
				text : '',
				algorithms : ['Alg3', 'Alg4']
			})).toBe(false);
		});

		it('Expects isInFilter to return true if text is is title or abstrct, case insensitive', function() {
			expect(testModel.isInFilter({
				text : 'Title',
				algorithms : []
			})).toBe(true);

			expect(testModel.isInFilter({
				text : 'abstract',
				algorithms : []
			})).toBe(true);
		});

		it('Expects isInFilter to return false if text is not in title or abstrct', function() {
			expect(testModel.isInFilter({
				text : 'hello',
				algorithms : []
			})).toBe(false);
		});

		it('Expects that if all filters are specified, isInFilter return true if all tests pass, otherwise false', function() {
			expect(testModel.isInFilter({
				text : 'abstract',
				algorithms : ['Alg1', 'Alg3']
			})).toBe(true);

			expect(testModel.isInFilter({
				text : 'hello',
				algorithms : ['Alg1', 'Alg3']
			})).toBe(false);

			expect(testModel.isInFilter({
				text : 'Title',
				algorithms : ['Alg3', 'Alg4']
			})).toBe(false);
		});
	});
});