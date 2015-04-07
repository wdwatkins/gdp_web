
<%@page contentType="text/html" pageEncoding="UTF-8"%>


<!DOCTYPE html>
<html>

    <head>
		
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

		String applicationVersion = props.get("application.version");
		String versionJquery = props.get("version.jquery");
		String versionJqueryUi = props.get("version.jquery.ui");
		String versionBootstrap = props.get("version.bootstrap");
		String versionFontAwesome = props.get("version.fontawesome");
		String versionOpenLayers = props.get("version.openlayers");
		String versionSugar = props.get("version.sugarjs");
		String versionBootstrapSwitch = props.get("version.bootstrap.switch");
		String versionHandlebars = props.get("version.handlebars");

		%>
		
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GDP Page</title>
		<link type="text/css" rel="stylesheet" href="webjars/bootstrap/<%=versionBootstrap%>/css/bootstrap.min.css" />
		<link type="text/css" rel="stylesheet" href="webjars/bootstrap/<%=versionBootstrap%>/css/bootstrap-responsive.min.css" />
		<link type="text/css" rel="stylesheet" href="webjars/font-awesome/<%=versionFontAwesome%>/css/font-awesome.min.css" />
		<script type="text/javascript" src="webjars/jquery/<%= versionJquery%>/jquery.min.js"></script>
		<script type="text/javascript" src="webjars/bootstrap/<%=versionBootstrap%>/js/bootstrap.min.js"></script>
    </head>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
