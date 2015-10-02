<jsp:include page="js/log4javascript/log4javascript.jsp">
	<jsp:param name="relPath" value="<%= baseUrl %>" />
	<jsp:param name="debug-qualifier" value="<%= development%>" />
</jsp:include>

<script type="text/javascript" src="<%= baseUrl %>webjars/jquery/<%= versionJquery%>/jquery<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="<%= baseUrl %>webjars/bootstrap/<%= versionBootstrap%>/js/bootstrap<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="<%= baseUrl %>webjars/underscorejs/<%= versionUnderscore%>/underscore<%= development ? "" : "-min"%>.js"></script>
<script type="text/javascript" src="<%= baseUrl %>webjars/handlebars/<%= versionHandlebars%>/handlebars<%= development ? "" : ".min"%>.js"></script>
<script type="text/javascript" src="<%= baseUrl %>webjars/backbonejs/<%= versionBackbone%>/backbone<%= development ? "" : ".min"%>.js"></script>

