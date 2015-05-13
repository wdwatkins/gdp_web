<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

    <head>
		<%@include file="/WEB-INF/jsp/head.jsp" %>			
		<link rel="stylesheet" type="text/css" href="webjars/openlayers/<%= versionOpenLayers%>/theme/default/style.css" />
		<link rel="stylesheet" type="text/css" href="webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/css/jquery.fileupload.css">
		<link rel="stylesheet" type="text/css" href="css/gdp_custom.css">
	</head>
    <body>
		<div class="container">
			<header class="row">
				<jsp:include page="template/USGSHeader.jsp">
					<jsp:param name="relPath" value="" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-title" value="USGS Geo Data Portal" />
				</jsp:include>
			</header>

			<div class="row" id="advanced-page-content">
			</div>
			
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
		
		<script type="text/javascript" src="webjars/openlayers/<%= versionOpenLayers%>/OpenLayers<%= development ? "" : ".debug"%>.js"></script>
		<script type="text/javascript" src="webjars/jquery-ui/<%= versionJqueryUI%>/jquery-ui<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/js/jquery.fileupload.js"></script>
		<script type="text/javascript" src="webjars/bootstrap-datepicker/<%= versionBsDatePicker%>/js/bootstrap-datepicker<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="js/vendor/jQuery.download<%= resourceSuffix %>.js"></script>
		
		<script type="text/javascript" src="js/util/jqueryUtils<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/templateLoader<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/BaseView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/SelectMenuView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/AlertView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/parseUri<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/models/Config<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/util/mapUtils<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/ogc/wfs<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/ogc/wps<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/models/Process<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/models/DataSourceModels<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/collections/Processes<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/models/ProcessVariablesModel<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/models/JobModel<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/views/HubSpatialMapView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/views/HubView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/views/SpatialView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/views/AlgorithmConfigView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/views/ProcessView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/views/DataDetailsView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/controller/AdvancedRouter<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="js/advanced/init<%= resourceSuffix %>.js"></script>
    </body>
</html>
