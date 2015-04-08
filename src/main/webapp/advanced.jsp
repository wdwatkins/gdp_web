<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

    <head>
		<%@include file="jsp/head.jsp" %>
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

			<h1>Advanced page placeholder</h1>
			
			<div class="row">
				<jsp:include page="template/USGSFooter.jsp">
					<jsp:param name="relPath" value="" />
					<jsp:param name="header-class" value="" />
					<jsp:param name="site-url" value="<script type='text/javascript'>document.write(document.location.href);</script>" />
					<jsp:param name="contact-info" value="<a href='mailto:gdp@usgs.gov?Subject=GDP%20Derivative%20Portal%20Help%20Request'>Contact the Geo Data Portal team</a>" />
				</jsp:include>
			</div>
		</div>
    </body>
</html>
