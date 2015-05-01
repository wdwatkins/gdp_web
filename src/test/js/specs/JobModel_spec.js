describe('GDP.ADVANCED.model.Job', function() {
	var PROCESSES = [{
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

	var jobModel;

	beforeEach(function() {
		jobModel = new GDP.ADVANCED.model.Job();
		jobModel.get('processes').reset(PROCESSES);

	})

	it('Expects getSelectedAlgorithmProcess return undefined if no algorithmId is defined', function() {
		expect(jobModel.getSelectedAlgorithmProcess()).not.toBeDefined();
	});

	it('Expects getSelectedAlgorithmProcess to return the process associated with the model\'s algorithmId', function() {
		jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
		expect(jobModel.getSelectedAlgorithmProcess().get('name')).toEqual('FeatureWeightedGridStatisticsAlgorithm');
	});

	it('Expects getProcessInputs to return null if the algorithmId has not been set', function() {
		expect(jobModel.getProcessInputs()).toBe(null);
	});

	it('Expects getProcessInputs to return the inputs minus excluded inputs', function() {
		jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
		var inputs = jobModel.getProcessInputs();
		expect(inputs.length).toBe(4);
	});
});