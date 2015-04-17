<jsp:include page="js/log4javascript/log4javascript.jsp">
	<jsp:param name="relPath" value="" />
	<jsp:param name="debug-qualifier" value="<%= development%>" />
</jsp:include>

<script type="text/javascript" src="webjars/jquery/<%= versionJquery%>/jquery<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/bootstrap/<%= versionBootstrap%>/js/bootstrap<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/underscorejs/<%= versionUnderscore%>/underscore<%= development ? "" : "-min"%>.js"></script>
<script type="text/javascript" src="webjars/handlebars/<%= versionHandlebars%>/handlebars<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/backbonejs/<%= versionBackbone%>/backbone<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/openlayers/<%= versionOpenLayers%>/OpenLayers<%= development ? "" : ".debug"%>.js"></script>
<script type="text/javascript" src="webjars/jquery-ui/<%= versionJqueryUI%>/jquery-ui<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="webjars/jquery-file-upload/<%= versionJqueryFileUpload%>/js/jquery.fileupload.js"></script>
<script type="text/javascript" src="webjars/bootstrap-datepicker/<%= versionBsDatePicker%>/js/bootstrap-datepicker<%= development ? "" : ".min"%>.js"></script>

