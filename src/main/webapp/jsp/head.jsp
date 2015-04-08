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
String versionProject = props.get("version.project");
String versionJquery = props.get("version.jquery");
String versionBootstrap = props.get("version.bootstrap");
String versionFontAwesome = props.get("version.fontawesome");
String versionOpenLayers = props.get("version.openlayers");
String versionHandlebars = props.get("version.handlebars");
String versionBackbone = props.get("version.backbone");
String versionUnderscore = props.get("version.underscore");

%>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GDP Page</title>

<link type="text/css" rel="stylesheet" href="webjars/bootstrap/<%= versionBootstrap%>/css/bootstrap<%= development ? "" : ".min"%>.css" />
<link type="text/css" rel="stylesheet" href="webjars/font-awesome/<%= versionFontAwesome%>/css/font-awesome<%= development ? "" : ".min"%>.css" />

<script type="text/javascript" src="webjars/jquery/<%= versionJquery%>/jquery<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/bootstrap/<%= versionBootstrap%>/js/bootstrap<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/underscorejs/<%= versionUnderscore%>/underscore<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/backbonejs/<%= versionBackbone%>/backbone<%= development ? "" : ".min"%>.js"></script>