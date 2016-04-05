<%@page language="java" contentType="application/json; charset=UTF-8" %>
<%@page import="java.io.File"%>
<%@page import="java.net.URL"%>
<%@page import="gov.usgs.cida.config.DynamicReadOnlyProperties"%>

<%!
	protected DynamicReadOnlyProperties props = null;

	{
		try {
			URL applicationProperties = getClass().getClassLoader().getResource("application.properties");
			File propsFile = new File(applicationProperties.toURI());
			props = new DynamicReadOnlyProperties(propsFile);
			props = props.addJNDIContexts(new String[0]);
		} catch (Exception e) {
			/* How should we bail if this hits an error? */
		}
	}
%>
<%
	Boolean development = Boolean.parseBoolean(props.getProperty("gdp.development"));
	String maxPolygonsToShowAttributeValues = props.get("gdp.application.maxPolygonsToShowAttributeValues");
	maxPolygonsToShowAttributeValues = (maxPolygonsToShowAttributeValues == null) ? "1000" : maxPolygonsToShowAttributeValues;
	String geoserverEndpoint = props.get("gdp.geoserver.endpoint");
	String baseUrl = props.getProperty("gdp.base.url");
	if (!baseUrl.endsWith("/")) { baseUrl += "/"; }
	/* serviceEndpoints below point at the actual endpoints versus endpoints which can be proxies */
%>
{
	"application" : {
		"development" : "<%= development %>",
		"maxPolygonsToShowAttributeValues" : <%= maxPolygonsToShowAttributeValues%>,
		"endpoints" : {
			"wms" : "<%= baseUrl %>geoserver/wms",
			"wfs" : "<%= baseUrl %>geoserver/wfs",
			"utilityWps" : "<%= baseUrl %>utilityWps",
			"processWps" : "<%= baseUrl %>processWps",
			"csw" : "<%= baseUrl %>csw",
			"catalogWms" : "<%= baseUrl %>catalogwms"
		},
		"serviceEndpoints" : {
			"wfs" : "<%= geoserverEndpoint %>/wfs"
		}
	},
	"process" : {
		"processes" : [
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageIntersectionAlgorithm",
				"name" : "FeatureCoverageIntersectionAlgorithm",
				"title" : "WCS Subset",
				"type" : "Data Subsets",
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
							},
							{
								"format" : {
									"mime-type" : "text/xml",
									"schema" : "http://schemas.opengis.net/gml/2.1.1/feature.xsd<"
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
						"identifier" : "DATASET_URI",
						"title" : "Dataset URI",
						"abstract" : "The base data web service URI for the dataset of interest. The data web service must adhere to the Web Coverage Service standard.",
						"input-type" : "uri",
						"data-type" : "any",
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
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageOPeNDAPIntersectionAlgorithm",
				"name" : "FeatureCoverageOPeNDAPIntersectionAlgorithm",
				"title" : "OPeNDAP Subset",
				"type" : "Data Subsets",
				"abstract" : "This service returns the subset of data that intersects a set of vector polygon features and time range, if specified. A NetCDF file will be returned.",
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
							},
							{
								"format" : {
									"mime-type" : "text/xml",
									"schema" : "http://schemas.opengis.net/gml/2.1.1/feature.xsd<"
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
						"identifier" : "DATASET_URI",
						"title" : "Dataset URI",
						"abstract" : "The base data web service URI for the dataset of interest. The data web service must adhere to the Web Coverage Service standard.",
						"input-type" : "literal",
						"data-type" : "uri",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "DATASET_ID",
						"title" : "Dataset Identifier",
						"abstract" : "The unique identifier for the data type or variable of interest.",
						"input-type" : "literal",
						"data-type" : "string",
						"minOccurs" : "1",
						"maxOccurs" : "2147483647"
					},
					{
						"identifier" : "TIME_START",
						"title" : "Time Start",
						"abstract" : "The date to begin analysis.",
						"input-type" : "literal",
						"data-type" : "dateTime",
						"minOccurs" : "0",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "TIME_END",
						"title" : "Time End",
						"abstract" : "The date to end analysis.",
						"input-type" : "literal",
						"data-type" : "dateTime",
						"minOccurs" : "0",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "OUTPUT_TYPE",
						"title" : "Output Format Type",
						"abstract" : "The output type format for this request. Current implementations: netcdf and geotiff.",
						"input-type" : "literal",
						"data-type" : "string",
						"options" : [
							"netcdf",
							"geotiff"
						],
						"default" : "netcdf",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					}
				],
				"outputs" : [
					{
						"identifier" : "OUTPUT",
						"title" : "Output File",
						"abstract" : "A NetCDF file containing requested data.",
						"output-type" : "complex",
						"format" : "application/netcdf"
					}
				]
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCategoricalGridCoverageAlgorithm",
				"name" : "FeatureCategoricalGridCoverageAlgorithm",
				"title" : "Categorical Coverage Fraction",
				"type" : "Areal Statistics",
				"abstract" : "This processing service is used with categorical gridded data to assess the percent coverage of each category for a set of features. This service does not process gridded time series. Using the feature dataset bounding-box, a subset of the gridded dataset is requested from the remote gridded data server. The location of each grid-cell center is then projected to the feature dataset coordinate reference system. For each grid-cell in the subsetted grid, the grid-cell center is tested for inclusion in each feature in the feature dataset. If the grid-cell center is in a given feature, the count for that cell's category is incremented for that feature. After all the grid-cell centers are processed the coverage fraction for each category is calculated for each feature.",
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
							},
							{
								"format" : {
									"mime-type" : "text/xml",
									"schema" : "http://schemas.opengis.net/gml/2.1.1/feature.xsd<"
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
						"identifier" : "DATASET_URI",
						"title" : "Dataset URI",
						"abstract" : "The base data web service URI for the dataset of interest. The data web service must adhere to the Web Coverage Service standard.",
						"input-type" : "literal",
						"data-type" : "uri",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "DATASET_ID",
						"title" : "Dataset Identifier",
						"abstract" : "The unique identifier for the data type or variable of interest.",
						"input-type" : "literal",
						"data-type" : "string",
						"minOccurs" : "1",
						"maxOccurs" : "2147483647"
					},
					{
						"identifier" : "DELIMITER",
						"title" : "Delimiter",
						"abstract" : "The delimiter that will be used to separate columns in the processing output.",
						"input-type" : "literal",
						"data-type" : "string",
						"default" : "COMMA",
						"minOccurs" : "1",
						"maxOccurs" : "1",
						"options" : [
							"COMMA",
							"TAB",
							"SPACE"
						]
					}
				],
				"outputs" : [
					{
						"identifier" : "OUTPUT",
						"title" : "Output File",
						"abstract" : "A NetCDF file containing requested data.",
						"output-type" : "complex",
						"format" : "application/netcdf"
					}
				]
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm",
				"name" : "FeatureWeightedGridStatisticsAlgorithm",
				"title" : "Area Grid Statistics (weighted)",
				"type" : "Areal Statistics",
				"abstract" : "This algorithm generates area weighted statistics of a gridded dataset for a set of vector polygon features. Using the bounding-box that encloses the feature data and the time range, if provided, a subset of the gridded dataset is requested from the remote gridded data server. Polygon representations are generated for cells in the retrieved grid. The polygon grid-cell representations are then projected to the feature data coordinate reference system. The grid-cells are used to calculate per grid-cell feature coverage fractions. Area-weighted statistics are then calculated for each feature using the grid values and fractions as weights. If the gridded dataset has a time range the last step is repeated for each time step within the time range or all time steps if a time range was not supplied.",
				"inputs" : [
					{
						"identifier" : "FEATURE_ATTRIBUTE_NAME",
						"title" : "Feature Attribute Name",
						"abstract" : "The attribute that will be used to label column headers in processing output.",
						"input-type" : "literal",
						"data-type" : "attribute_name",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					},
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
							},
							{
								"format" : {
									"mime-type" : "text/xml",
									"schema" : "http://schemas.opengis.net/gml/2.1.1/feature.xsd<"
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
						"identifier" : "DATASET_URI",
						"title" : "Dataset URI",
						"abstract" : "The base data web service URI for the dataset of interest. The data web service must adhere to the Web Coverage Service standard.",
						"input-type" : "literal",
						"data-type" : "uri",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "DATASET_ID",
						"title" : "Dataset Identifier",
						"abstract" : "The unique identifier for the data type or variable of interest.",
						"input-type" : "literal",
						"data-type" : "string",
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
						"identifier" : "TIME_START",
						"title" : "Time Start",
						"abstract" : "The date to begin analysis.",
						"input-type" : "literal",
						"data-type" : "dateTime",
						"minOccurs" : "0",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "TIME_END",
						"title" : "Time End",
						"abstract" : "The date to end analysis.",
						"input-type" : "literal",
						"data-type" : "dateTime",
						"minOccurs" : "0",
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
						"identifier" : "GROUP_BY",
						"title" : "Group By",
						"abstract" : "If multiple features and statistics are selected, this will change whether the processing output columns are sorted according to statistics or feature attributes.",
						"input-type" : "literal",
						"data-type" : "string",
						"options" : [
							"STATISTIC",
							"FEATURE_ATTRIBUTE"
						],
						"minOccurs" : "1",
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
					},
					{
						"identifier" : "SUMMARIZE_FEATURE_ATTRIBUTE",
						"title" : "Summarize Feature Attribute",
						"abstract" : "If selected, processing output will include a final row of statistics summarizing all timesteps for each feature attribute value",
						"input-type" : "literal",
						"data-type" : "boolean",
						"default" : "false",
						"minOccurs" : "0",
						"maxOccurs" : "1"
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
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureGridStatisticsAlgorithm",
				"name" : "FeatureGridStatisticsAlgorithm",
				"title" : "Area Grid Statistics (unweighted)",
				"type" : "Areal Statistics",
				"abstract" : "This algorithm generates unweighted statistics of a gridded dataset for a set of vector polygon features. Using the bounding-box that encloses the feature data and the time range, if provided, a subset of the gridded dataset is requested from the remote gridded data server. Point representations of the grid cells are generated for cells in the retrieved grid. The point grid-cell representations are then projected to the feature data coordinate reference system. The grid points are intersected with the polygons in a point-in-polygon analysis. Areal Statistics are then calculated for each feature using the grid values. If the gridded dataset has a time range the last step is repeated for each time step within the time range or all time steps if a time range was not supplied. NOTE: The point-in-polygon analysis is not saved in memory; it is performed for every time step to allow very large scale analyses to function. This algorithm should not be used for long time series. See the weighted grid statistics algorithm for the majority of processing needs.",
				"inputs" : [
					{
						"identifier" : "FEATURE_ATTRIBUTE_NAME",
						"title" : "Feature Attribute Name",
						"abstract" : "The attribute that will be used to label column headers in processing output.",
						"input-type" : "literal",
						"data-type" : "attribute_name",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					},
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
							},
							{
								"format" : {
									"mime-type" : "text/xml",
									"schema" : "http://schemas.opengis.net/gml/2.1.1/feature.xsd<"
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
						"identifier" : "DATASET_URI",
						"title" : "Dataset URI",
						"abstract" : "The base data web service URI for the dataset of interest. The data web service must adhere to the Web Coverage Service standard.",
						"input-type" : "literal",
						"data-type" : "uri",
						"minOccurs" : "1",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "DATASET_ID",
						"title" : "Dataset Identifier",
						"abstract" : "The unique identifier for the data type or variable of interest.",
						"input-type" : "literal",
						"data-type" : "string",
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
						"identifier" : "TIME_START",
						"title" : "Time Start",
						"abstract" : "The date to begin analysis.",
						"input-type" : "literal",
						"data-type" : "dateTime",
						"minOccurs" : "0",
						"maxOccurs" : "1"
					},
					{
						"identifier" : "TIME_END",
						"title" : "Time End",
						"abstract" : "The date to end analysis.",
						"input-type" : "literal",
						"data-type" : "dateTime",
						"minOccurs" : "0",
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
						"identifier" : "GROUP_BY",
						"title" : "Group By",
						"abstract" : "If multiple features and statistics are selected, this will change whether the processing output columns are sorted according to statistics or feature attributes.",
						"input-type" : "literal",
						"data-type" : "string",
						"options" : [
							"STATISTIC",
							"FEATURE_ATTRIBUTE"
						],
						"minOccurs" : "1",
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
					},
					{
						"identifier" : "SUMMARIZE_FEATURE_ATTRIBUTE",
						"title" : "Summarize Feature Attribute",
						"abstract" : "If selected, processing output will include a final row of statistics summarizing all timesteps for each feature attribute value",
						"input-type" : "literal",
						"data-type" : "boolean",
						"default" : "false",
						"minOccurs" : "0",
						"maxOccurs" : "1"
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
		]
	},
	"map" : {
		"extent" : {
			"conus" : {
				"3857" : [-14819398.304233, -92644.611414691, -6718296.2995848, 9632591.3700111]
			}
		}
	}
}