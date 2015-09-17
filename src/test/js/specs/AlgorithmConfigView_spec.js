describe('GDP.PROCESS_CLIENT.view.AlgorithmConfigView', function() {
	var templateSpy;
	var jobModel;

	var PROCESSES =
		[{
			"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageIntersectionAlgorithm",
			"name" : "FeatureCoverageIntersectionAlgorithm",
			"title" : "WCS Subset",
			"abstract" : "This service returns the subset of data that intersects a set of vector polygon features and a Web Coverage Service (WCS) data source. A GeoTIFF file will be returned.",
			"inputs" : [
				{
					"identifier" : "REQUIRE_FULL_COVERAGE",
					"title" : "Require Full Coverage",
					"abstract" : "If turned on, the service will require that the dataset of interest fully cover the polygon analysis zone data.",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "FEATURE_COLLECTION",
					"title" : "Feature Collection",
					"abstract" : "A feature collection encoded as a WFS request or one of the supported GML profiles.",
					"input-type" : "complex",
					"minOccurs" : "1",
					"maxOccurs" : "1",
					"data-type" : [
						{
							"format" : {
								"mime-type" : "text/xml",
								"schema" : "http://schemas.opengis.net/gml/2.0.0/feature.xsd"
							}
						}
					],
					"default" : {
						"format" : {
							"mime-type" : "text/xml",
							"schema" : "http://schemas.opengis.net/gml/2.0.0/feature.xsd"
						}
					}
				},
				{
					"identifier" : "DATASET_ID",
					"title" : "Dataset Identifier",
					"abstract" : "The unique identifier for the data type or variable of interest.",
					"input-type" : "literal",
					"data-type" : "string",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "2147483647"
				}
			],
			"outputs" : [
				{
					"identifier" : "OUTPUT",
					"title" : "Output File",
					"abstract" : "A GeoTIFF file containing the requested data.",
					"output-type" : "complex",
					"format" : "image/geotiff"
				}
			]
		},
		{
			"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm",
			"name" : "FeatureWeightedGridStatisticsAlgorithm",
			"title" : "Area Grid Statistics (weighted)",
			"abstract" : "This algorithm generates area weighted statistics of a gridded dataset for a set of vector polygon features. Using the bounding-box that encloses the feature data and the time range, if provided, a subset of the gridded dataset is requested from the remote gridded data server. Polygon representations are generated for cells in the retrieved grid. The polygon grid-cell representations are then projected to the feature data coordinate reference system. The grid-cells are used to calculate per grid-cell feature coverage fractions. Area-weighted statistics are then calculated for each feature using the grid values and fractions as weights. If the gridded dataset has a time range the last step is repeated for each time step within the time range or all time steps if a time range was not supplied.",
			"inputs" : [
				{
					"identifier" : "REQUIRE_FULL_COVERAGE",
					"title" : "Require Full Coverage",
					"abstract" : "If turned on, the service will require that the dataset of interest fully cover the polygon analysis zone data.",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "DATASET_ID",
					"title" : "Dataset Identifier",
					"abstract" : "The unique identifier for the data type or variable of interest.",
					"input-type" : "literal",
					"data-type" : "string",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "2147483647"
				},
				{
					"identifier" : "DELIMITER",
					"title" : "Delimiter",
					"abstract" : "The delimiter that will be used to separate columns in the processing output.",
					"input-type" : "literal",
					"data-type" : "string",
					"options" : [
						"COMMA",
						"TAB",
						"SPACE"
					],
					"default" : "COMMA",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "SUMMARIZE_TIMESTEP",
					"title" : "Summarize Timestep",
					"abstract" : "If selected, processing output will include columns with summarized statistics for all feature attribute values for each timestep",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "false",
					"minOccurs" : "0",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "STATISTICS",
					"title" : "Statistics",
					"abstract" : "Statistics that will be returned for each feature in the processing output.",
					"input-type" : "literal",
					"data-type" : "string",
					"options" : [
						"MEAN",
						"MINIMUM",
						"MAXIMUM",
						"VARIANCE",
						"STD_DEV",
						"SUM",
						"COUNT"
					],
					"minOccurs" : "1",
					"maxOccurs" : "7"
				}
			],
			"outputs" : [
				{
					"identifier" : "OUTPUT",
					"title" : "Output File",
					"abstract" : "A delimited text file containing requested process output.",
					"output-type" : "complex",
					"format" : "text/csv"
				}
			]
		}
	];

	beforeEach(function() {
		templateSpy = jasmine.createSpy('templateSpy');
		jobModel = new GDP.PROCESS_CLIENT.model.Job({
			algorithmId : '',
			processes : new Backbone.Collection({
				model : Backbone.Model
			}),
			processVariables : new Backbone.Model()
		});
		jobModel.get('processes').reset(PROCESSES);

		spyOn(GDP.PROCESS_CLIENT.view.AlgorithmConfigView.prototype, 'updateProcessVariable').andCallThrough();
	});

	describe('Tests initialization with empty model', function() {
		var testView;

		beforeEach(function() {
			testView = new GDP.PROCESS_CLIENT.view.AlgorithmConfigView({
				template : templateSpy,
				model : jobModel,
				el : 'test-div'
			});
		});

		it('Expects the template not to be rendered', function() {
			expect(templateSpy).not.toHaveBeenCalled();
		});

		it('Expects that updateProcessVariable will not be called', function() {
			expect(GDP.PROCESS_CLIENT.view.AlgorithmConfigView.prototype.updateProcessVariable).not.toHaveBeenCalled();
		});
	});

	describe('Tests initialization with some processVariables defined and and an algorithmId', function() {
		var testView;

		beforeEach(function() {
			jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
			jobModel.get('processVariables').set({
				'STATISTICS' : ['MINIMUM', 'MAXIMUM'],
				'SUMMARIZE_TIMESTEP' : 'false'
			});

			testView = new GDP.PROCESS_CLIENT.view.AlgorithmConfigView({
				template : templateSpy,
				model : jobModel,
				el : 'test-div'
			});
		});

		it('Expects the template to be rendered', function() {
			var expectedResult = [
				{
					"identifier" : "REQUIRE_FULL_COVERAGE",
					"title" : "Require Full Coverage",
					"abstract" : "If turned on, the service will require that the dataset of interest fully cover the polygon analysis zone data.",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "DELIMITER",
					"title" : "Delimiter",
					"abstract" : "The delimiter that will be used to separate columns in the processing output.",
					"input-type" : "literal",
					"data-type" : "string",
					"options" : [
						"COMMA",
						"TAB",
						"SPACE"
					],
					"default" : "COMMA",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "SUMMARIZE_TIMESTEP",
					"title" : "Summarize Timestep",
					"abstract" : "If selected, processing output will include columns with summarized statistics for all feature attribute values for each timestep",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "false",
					"minOccurs" : "0",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "STATISTICS",
					"title" : "Statistics",
					"abstract" : "Statistics that will be returned for each feature in the processing output.",
					"input-type" : "literal",
					"data-type" : "string",
					"options" : [
						"MEAN",
						"MINIMUM",
						"MAXIMUM",
						"VARIANCE",
						"STD_DEV",
						"SUM",
						"COUNT"
					],
					"minOccurs" : "1",
					"maxOccurs" : "7"
				}
			];
			expect(templateSpy).toHaveBeenCalledWith({
				job : jobModel.attributes,
				inputs : expectedResult,
				outputs : []
			});
		});

		it('Expects that updateProcessVariables will be called with each defined process variable in jobModel', function() {
			expect(GDP.PROCESS_CLIENT.view.AlgorithmConfigView.prototype.updateProcessVariable.calls.length).toBe(2);
			expect(GDP.PROCESS_CLIENT.view.AlgorithmConfigView.prototype.updateProcessVariable).toHaveBeenCalledWith(
				jobModel.get('processVariables'), 'STATISTICS');
			expect(GDP.PROCESS_CLIENT.view.AlgorithmConfigView.prototype.updateProcessVariable).toHaveBeenCalledWith(
				jobModel.get('processVariables'), 'SUMMARIZE_TIMESTEP');
		});
	});

	describe('Tests for updating process variables', function() {
		var testView;
		beforeEach(function() {
			jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
			jobModel.get('processVariables').set({
				'STATISTICS' : ['MINIMUM', 'MAXIMUM'],
				'SUMMARIZE_TIMESTEP' : 'false',
				'DATASET_ID' : 'abc'

			});

			$('body').append('<div id="test-div"><input type="text" id="input-DATASET_ID"><input type="checkbox" id="input-SUMMARIZE_TIMESTEP" /></div>');

			testView = new GDP.PROCESS_CLIENT.view.AlgorithmConfigView({
				template : templateSpy,
				model : jobModel,
				el : 'test-div'
			});
		});

		afterEach(function() {
			$('#test-div').remove();
		});

		it('Expects that if the variable represents boolean data that the checked property is updated', function() {
			var processVariables = jobModel.get('processVariables');

			processVariables.set('SUMMARIZE_TIMESTEP', 'true', 'SUMMARIZE_TIMESTEP');
			expect($('#input-SUMMARIZE_TIMESTEP').prop('checked')).toBe(true);

			processVariables.set('SUMMARIZE_TIMESTEP', 'false', 'SUMMARIZE_TIMESTEP');
			expect($('#input-SUMMARIZE_TIMESTEP').prop('checked')).toBe(false);
		});

		it('Expects that if the variable does not represent boolean data that the value attribute is updates', function() {
			var processVariables = jobModel.get('processVariables');

			processVariables.set('DATASET_ID', 'value1','DATASET_ID');
			expect($('#input-DATASET_ID').val()).toEqual('value1');

			processVariables.set('DATASET_ID', 'value2', 'DATASET_ID');
			expect($('#input-DATASET_ID').val()).toEqual('value2');
		});
	});

	describe('Tests for handling change events', function() {
		var testView;
		var ev;
		var processVariables;
		beforeEach(function() {
			jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
			jobModel.get('processVariables').set({
				'STATISTICS' : ['MINIMUM', 'MAXIMUM'],
				'SUMMARIZE_TIMESTEP' : 'false',
				'DATASET_ID' : 'abc'
			});
			testView = new GDP.PROCESS_CLIENT.view.AlgorithmConfigView({
				template : templateSpy,
				model : jobModel,
				el : 'test-div'
			});

			processVariables = jobModel.get('processVariables');
		});

		it('Expects calling changeBooleanProcessVariable to use the checked property to set the variable', function() {
			var ev = {
				target : {
					id : 'input-DATASET_ID',
					checked : true,
					value : 'junk'
				}
			};
			testView.changeBooleanProcessVariable(ev);
			expect(processVariables.get('DATASET_ID')).toEqual('true');

			ev.target.checked = false;
			testView.changeBooleanProcessVariable(ev);
			expect(processVariables.get('DATASET_ID')).toEqual('false');
		});

		it('Expects calling changeTextProcessVariable to use the value property to set the process variable', function() {
			var ev = {
				target : {
					id : 'input-DATASET_ID',
					value : 'this'
				}
			};
			testView.changeTextProcessVariable(ev);
			expect(processVariables.get('DATASET_ID')).toEqual('this');

			ev.target.value = 'that';
			testView.changeTextProcessVariable(ev);
			expect(processVariables.get('DATASET_ID')).toEqual('that');
		});
	});
});