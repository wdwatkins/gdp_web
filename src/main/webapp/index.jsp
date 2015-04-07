
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
			props = new DynamicReadOnlyProperties();
			props = props.addJNDIContexts(new String[0]);
        } catch (Exception e) {
        }
		}
		%>
		
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GDP Page</title>
		<link type="text/css" rel="stylesheet" href="webjars/bootstrap/3.3.4/css/bootstrap.min.css" />
		<link type="text/css" rel="stylesheet" href="webjars/bootstrap/3.3.4/css/bootstrap-responsive.min.css" />
		<link type="text/css" rel="stylesheet" href="webjars/font-awesome/4.3.0/css/font-awesome.min.css" />

		<script type="text/javascript" src="webjars/jquery/1.11.2/jquery.min.js"></script>
		<script type="text/javascript" src="webjars/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    </head>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
