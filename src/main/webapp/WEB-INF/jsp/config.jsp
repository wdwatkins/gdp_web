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
			"geoserver" : "/geoserver"
		}
	},
	"process" : {
		"processes" : [
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageIntersectionAlgorithm" 
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageOPeNDAPIntersectionAlgorithm"
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCategoricalGridCoverageAlgorithm"
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm"
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureGridStatisticsAlgorithm"
			},
			{ 
				"id" : "gov.usgs.cida.gdp.wps.algorithm.PRMSParameterGeneratorAlgorithm"
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