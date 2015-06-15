/*global GDP*/
/*global expect*/
/*global jasmine*/
/*global spyOn*/
/*global OpenLayers*/

describe('GDP.LANDING.views.DataSetTileView', function() {
	var templateSpy;
	var testModel;
	var testView;
	var addLayerSpy, renderSpy, zoomToExtentSpy;

	beforeEach(function() {
		templateSpy = jasmine.createSpy('templateSpy');
		addLayerSpy = jasmine.createSpy('addLayerSpy');
		renderSpy = jasmine.createSpy('renderSpy');
		zoomToExtentSpy = jasmine.createSpy('zoomToExtentSpy');

		GDP.algorithms = {
			get : jasmine.createSpy('algorithmsGetSpy').andReturn({'ID1' : ['Alg1', 'Alg2']})
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
		GDP.LANDING.templates = {
			getTemplate : jasmine.createSpy('getTemplateSpy').andReturn(templateSpy)
		};
		spyOn(GDP.util.mapUtils, 'createMap').andReturn({
			addLayer : addLayerSpy,
			render : renderSpy,
			zoomToExtent : zoomToExtentSpy
		});

		spyOn(GDP.LANDING.views, 'DataSetDialogView');

		testModel = new GDP.models.DataSetModel({identificationInfo : []});
		testModel.set({
			abstrct : 'Abstract1',
			bounds : new OpenLayers.Bounds([1, 2, 3, 4]),
			identifier : 'ID1',
			modified : 'yes',
			subject : 'Subject1',
			title : 'Title1',
			type : 'value1'
		});

		$('body').append('<div id="test-dialog"></div>');

		testView = new GDP.LANDING.views.DataSetTileView({
			template : templateSpy,
			model : testModel,
			dialogEl : $('#test-div')
		});
	});

	afterEach(function() {
		$('#test-dialog').remove();
	});

	it('Expects that the template is created using the model\'s attributes as the context', function() {
		expect(templateSpy).toHaveBeenCalledWith(testModel.attributes);
	});

	it('Expects a map to be create with a layer representing the bounds in the model', function() {
		expect(GDP.util.mapUtils.createMap).toHaveBeenCalled();
		expect(testView.boundsLayer).toBeDefined();
	});

	it('Expects that showDetails will create a detailView', function() {
		testView.showDetails();
		expect(GDP.LANDING.views.DataSetDialogView).toHaveBeenCalled();
		expect(GDP.LANDING.views.DataSetDialogView.calls[0].args[0].model).toEqual(testModel);
		expect(GDP.LANDING.views.DataSetDialogView.calls[0].args[0].el).toEqual($('#test-div'));
	});
});