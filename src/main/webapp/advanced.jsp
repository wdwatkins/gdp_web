<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

    <head>
		<%@include file="/WEB-INF/jsp/head.jsp" %>
		<link rel="stylesheet" type="text/css" href="webjars/openlayers/<%= versionOpenLayers%>/theme/default/style.css" />
		<link rel="stylesheet" type="text/css" href="webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/css/jquery.fileupload.css">
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
	</head>
    <body>
		<div class="container">
			<div class="row">
				<jsp:include page="template/USGSHeader.jsp">
					<jsp:param name="relPath" value="" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-title" value="USGS Geo Data Portal" />
				</jsp:include>
			</div>

			<div id="advanced-page-content"></div>
			
			<div class="row">
				<jsp:include page="template/USGSFooter.jsp">
					<jsp:param name="relPath" value="" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-url" value="<script type='text/javascript'>document.write(document.location.href);</script>" />
					<jsp:param name="contact-info" value="<a href='mailto:gdp@usgs.gov?Subject=GDP%20Derivative%20Portal%20Help%20Request'>Contact the Geo Data Portal team</a>" />
				</jsp:include>
			</div>
		</div>
		
		<%@include file="/WEB-INF/jsp/scripts.jsp" %>
		
		<script type="text/javascript" src="webjars/openlayers/<%= versionOpenLayers%>/OpenLayers<%= development ? "" : ".debug"%>.js"></script>
		<script type="text/javascript" src="webjars/jquery-ui/<%= versionJqueryUI%>/jquery-ui<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/js/jquery.fileupload.js"></script>
		<script type="text/javascript" src="webjars/bootstrap-datepicker/<%= versionBsDatePicker%>/js/bootstrap-datepicker<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="js/util/templateLoader.js"></script>
		<script type="text/javascript" src="js/util/BaseView.js"></script>
		<script type="text/javascript" src="js/util/SelectMenuView.js"></script>
		<script type="text/javascript" src="js/util/AlertView.js"></script>
		<script type="text/javascript" src="js/models/Config.js"></script>
		<script type="text/javascript" src="js/util/mapUtils.js"></script>
		<script type="text/javascript" src="js/ogc/wfs.js"></script>
		<script type="text/javascript" src="js/ogc/wps.js"></script>
		<script type="text/javascript" src="js/advanced/models/Process.js"></script>
		<script type="text/javascript" src="js/advanced/models/DataSourceModels.js"></script>
		<script type="text/javascript" src="js/advanced/collections/Processes.js"></script>
		<script type="text/javascript" src="js/advanced/models/ProcessVariablesModel.js"></script>
		<script type="text/javascript" src="js/advanced/models/JobModel.js"></script>
		<script type="text/javascript" src="js/advanced/views/HubView.js"></script>
		<script type="text/javascript" src="js/advanced/views/SpatialView.js"></script>
		<script type="text/javascript" src="js/advanced/views/AlgorithmConfigView.js"></script>
		<script type="text/javascript" src="js/advanced/views/ProcessView.js"></script>
		<script type="text/javascript" src="js/advanced/views/DataDetailsView.js"></script>
		<script type="text/javascript" src="js/advanced/controller/AdvancedRouter.js"></script>
		<script type="text/javascript" src="js/advanced/init.js"></script>
    </body>
</html>
