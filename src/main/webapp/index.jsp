<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

    <head>
		<%@include file="/WEB-INF/jsp/head.jsp" %>
		<link rel="stylesheet" type="text/css" href="css/gdp_custom.css">
	</head>
    <body>
		<div class="container-fluid">
			<header class="row">
				<jsp:include page="template/USGSHeader.jsp">
					<jsp:param name="relPath" value="" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-title" value="USGS Geo Data Portal" />
				</jsp:include>
			</header>

			<div class="jumbotron">
				<h1>Welcome to GDP</h1>
				<div>Here's where to put the latest and greatest information about GDP</div>
			</div>
			<div id="home-page-content"></div>
			
			<footer class="row">
				<jsp:include page="template/USGSFooter.jsp">
					<jsp:param name="relPath" value="" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-url" value="<script type='text/javascript'>document.write(document.location.href);</script>" />
					<jsp:param name="contact-info" value="<a href='mailto:gdp@usgs.gov?Subject=GDP%20Derivative%20Portal%20Help%20Request'>Contact the Geo Data Portal team</a>" />
				</jsp:include>
			</footer>
		</div>
		<%@include file="/WEB-INF/jsp/scripts.jsp" %>
		
		<script type="text/javascript" src="webjars/openlayers/<%= versionOpenLayers%>/OpenLayers<%= development ? ".debug" :"" %>.js"></script>
		<script type="text/javascript" src="openlayers/extensions/format/csw/v2_0_2.js"></script>		
		<script type="text/javascript" src="js/util/templateLoader<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/BaseView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/mapUtils<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/ogc/csw<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/models/Config<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/models/DataSetModel<%= resourceSuffix %>.js"></script>	
		<script type="text/javascript" src="js/landing/views/DataSourceSelectionView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/landing/views/DataSetTileView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/landing/views/DataSetDialogView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/landing/controller/LandingRouter<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/landing/init<%= resourceSuffix %>.js"></script>
	
    </body>
</html>
