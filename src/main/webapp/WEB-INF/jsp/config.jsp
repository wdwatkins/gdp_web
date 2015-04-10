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
%>
{
	"application" : {
		"development" : "<%= development %>",
		"endpoints" : {
			"geoserver" : "geoserver"
		}
	},
	"process" : {
		"processes" : [
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageIntersectionAlgorithm",
				"name" : "FeatureCoverageIntersectionAlgorithm",
				"title" : "WCS Subset",
				"abstract" : "This service returns the subset of data that intersects a set of vector polygon features and a Web Coverage Service (WCS) data source. A GeoTIFF file will be returned."
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageOPeNDAPIntersectionAlgorithm",
				"name" : "FeatureCoverageOPeNDAPIntersectionAlgorithm",
				"title" : "OPeNDAP Subset",
				"abstract" : "This service returns the subset of data that intersects a set of vector polygon features and time range, if specified. A NetCDF file will be returned."
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCategoricalGridCoverageAlgorithm",
				"name" : "FeatureCategoricalGridCoverageAlgorithm",
				"title" : "Categorical Coverage Fraction",
				"abstract" : "This processing service is used with categorical gridded data to assess the percent coverage of each category for a set of features. This service does not process gridded time series. Using the feature dataset bounding-box, a subset of the gridded dataset is requested from the remote gridded data server. The location of each grid-cell center is then projected to the feature dataset coordinate reference system. For each grid-cell in the subsetted grid, the grid-cell center is tested for inclusion in each feature in the feature dataset. If the grid-cell center is in a given feature, the count for that cell's category is incremented for that feature. After all the grid-cell centers are processed the coverage fraction for each category is calculated for each feature." 
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm",
				"name" : "FeatureWeightedGridStatisticsAlgorithm",
				"title" : "Area Grid Statistics (weighted)",
				"abstract" : "This algorithm generates area weighted statistics of a gridded dataset for a set of vector polygon features. Using the bounding-box that encloses the feature data and the time range, if provided, a subset of the gridded dataset is requested from the remote gridded data server. Polygon representations are generated for cells in the retrieved grid. The polygon grid-cell representations are then projected to the feature data coordinate reference system. The grid-cells are used to calculate per grid-cell feature coverage fractions. Area-weighted statistics are then calculated for each feature using the grid values and fractions as weights. If the gridded dataset has a time range the last step is repeated for each time step within the time range or all time steps if a time range was not supplied."
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureGridStatisticsAlgorithm",
				"name" : "FeatureGridStatisticsAlgorithm",
				"title" : "Area Grid Statistics (unweighted)",
				"abstract" : "This algorithm generates unweighted statistics of a gridded dataset for a set of vector polygon features. Using the bounding-box that encloses the feature data and the time range, if provided, a subset of the gridded dataset is requested from the remote gridded data server. Polygon representations are generated for cells in the retrieved grid. The polygon grid-cell representations are then projected to the feature data coordinate reference system. The grid-cells are used to calculate per grid-cell feature coverage fractions. Area-weighted statistics are then calculated for each feature using the grid values and fractions as weights. If the gridded dataset has a time range the last step is repeated for each time step within the time range or all time steps if a time range was not supplied."
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.PRMSParameterGeneratorAlgorithm",
				"name" : "PRMSParameterGeneratorAlgorithm",
				"title" : "PRMS Parameter Generator",
				"abstract" : "PRMS Parameter Generator"
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