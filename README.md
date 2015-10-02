# gdp_web
Web UI for Geo Data Portal

## Build instructions ##
This project has been built and deployed using maven 3, java 7 and tomcat 7.

To build the war execute the following command in the directory where you cloned the repository.
```
mvn clean package
```

This will produce a .war file in the `target` directory. You can deploy this war file to tomcat like any other war.

For help with tomcat:
* https://tomcat.apache.org/tomcat-7.0-doc/html-manager-howto.html#Deploy
* https://tomcat.apache.org/tomcat-7.0-doc/deployer-howto.html

The project requires the following JNDI variables in the context.xml. Example values are given.
```
<Environment name="gdp.endpoint.utilityWps" type="java.lang.String" value="http://cida.usgs.gov/gdp/utility/" />
<Environment name="gdp.endpoint.processWps" type="java.lang.String" value="http://cida.usgs.gov/gdp/process/" />
<Environment name="gdp.endpoint.csw" type="java.lang.String" value="https://www.sciencebase.gov/catalog/item/54dd2326e4b08de9379b2fb1/csw"/>
<Environment name="gdp.endpoint.catalogwms" type="java.lang.String" value="https://www.sciencebase.gov/catalogMaps/mapping/ows/" />

<Environment name="gdp.geoserver.endpoint" type="java.lang.String" value="http://cida.usgs.gov/gdp/geoserver/" />;
<Environment name="gdp.geoserver.password" type="java.lang.String" value="xxxxxxx" />
<Environment name="gdp.base.url" type="java.lang.String" value="http://localhost:8080/gdp_web/" />
```
The variable gdp.base.url is set to the standard tomcat deployment. 


