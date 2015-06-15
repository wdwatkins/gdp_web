<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

    <head>
		<%@include file="/WEB-INF/jsp/head.jsp" %>			
		<link rel="stylesheet" type="text/css" href="<%= baseUrl %>webjars/openlayers/<%= versionOpenLayers%>/theme/default/style.css" />
		<link rel="stylesheet" type="text/css" href="<%= baseUrl %>webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/css/jquery.fileupload.css">
		<link rel="stylesheet" type="text/css" href="<%= baseUrl %>css/process_client_custom.css">
		<link type="text/css" rel="stylesheet" href="<%= baseUrl %>webjars/bootstrap-datepicker/<%= versionBsDatePicker%>/css/bootstrap-datepicker3<%= development ? "" : ".min"%>.css" />
	</head>
    <body>
		<div class="container">
			<header class="row">
				<jsp:include page="template/USGSHeader.jsp">
					<jsp:param name="relPath" value="<%= baseUrl %>" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-title" value="USGS Geo Data Portal" />
				</jsp:include>
			</header>

			<div id="advanced-page-content">
			</div>
			
			<footer class="row">
				<jsp:include page="template/USGSFooter.jsp">
					<jsp:param name="relPath" value="<%= baseUrl %>" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-url" value="<script type='text/javascript'>document.write(document.location.href);</script>" />
					<jsp:param name="contact-info" value="<a href='mailto:gdp@usgs.gov?Subject=GDP%20Derivative%20Portal%20Help%20Request'>Contact the Geo Data Portal team</a>" />
				</jsp:include>
			</footer>
		</div>
		
		<%@include file="/WEB-INF/jsp/scripts.jsp" %>
		
		<script type="text/javascript" src="<%= baseUrl %>webjars/openlayers/<%= versionOpenLayers%>/OpenLayers<%= development ? "" : ".debug"%>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>openlayers/extensions/format/csw/v2_0_2.js"></script>		
		<script type="text/javascript" src="<%= baseUrl %>webjars/jquery-ui/<%= versionJqueryUI%>/jquery-ui<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/js/jquery.fileupload.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>webjars/bootstrap-datepicker/<%= versionBsDatePicker%>/js/bootstrap-datepicker<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/vendor/jQuery.download<%= resourceSuffix %>.js"></script>
		
		<script type="text/javascript" src="<%= baseUrl %>js/util/jqueryUtils<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/replaceURLWithHTMLLinks<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/templateLoader<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/BaseView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/SelectMenuView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/AlertView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/parseUri<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/util/mapUtils<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/ogc/wfs<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/ogc/wps<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/ogc/csw<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/models/Config<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/models/DataSetModel<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/models/Process<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/models/DataSourceModels<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/collections/Processes<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/models/ProcessVariablesModel<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/models/JobModel<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/views/HubSpatialMapView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/views/HubView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/views/SpatialView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/views/AlgorithmConfigView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/views/ProcessView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/views/DataDetailsView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/controller/ProcessClientRouter<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%= baseUrl %>js/process_client/init<%= resourceSuffix %>.js"></script>
    </body>
</html>
