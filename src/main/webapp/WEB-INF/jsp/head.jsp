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
String versionProject = props.get("version");
String versionJquery = props.get("version.jquery");
String versionBootstrap = props.get("version.bootstrap");
String versionFontAwesome = props.get("version.fontawesome");
String versionOpenLayers = props.get("version.openlayers");
String versionHandlebars = props.get("version.handlebars");
String versionBackbone = props.get("version.backbone");
String versionUnderscore = props.get("version.underscore");
String versionBsDatePicker= props.get("version.bsDatePicker");
String versionJqueryFileUpload = props.get("version.jqueryFileUpload");
String versionJqueryUI = props.get("version.jqueryUI");
String resourceSuffix = development ? "" : "-" + versionProject + "-min";
%>

<jsp:include page="template/USGSHead.jsp">
			<jsp:param name="relPath" value="" />
			<jsp:param name="shortName" value="USGS Geo Data Portal" />
			<jsp:param name="title" value="USGS Geo Data Portal" />
			<jsp:param name="description" value="" />
			<jsp:param name="author" value="Ivan Suftin" />
			<jsp:param name="keywords" value="" />
			<jsp:param name="publisher" value="" />
			<jsp:param name="revisedDate" value="" />
			<jsp:param name="nextReview" value="" />
			<jsp:param name="expires" value="never" />
			<jsp:param name="development" value="<%=development%>" />
</jsp:include>

<link type="text/css" rel="stylesheet" href="webjars/bootstrap/<%= versionBootstrap%>/css/bootstrap<%= development ? "" : ".min"%>.css" />
<link type="text/css" rel="stylesheet" href="webjars/font-awesome/<%= versionFontAwesome%>/css/font-awesome<%= development ? "" : ".min"%>.css" />
<link type="text/css" rel="stylesheet" href="webjars/bootstrap-datepicker/<%= versionBsDatePicker%>/css/bootstrap-datepicker3<%= development ? "" : ".min"%>.css" />
