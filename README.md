# gdp_web
Web UI for Geo Data Portal

## To run ##
install git, java 7, and maven 3, and tomcat 7

clone this repo

open a terminal, change to the directory where you cloned the repository

build a .war artifact by running the command:
```
mvn clean package
```

This will produce a .war file in the `target` directory. You can deploy this war file to tomcat like any other war.
Instructions:
https://tomcat.apache.org/tomcat-7.0-doc/html-manager-howto.html#Deploy
https://tomcat.apache.org/tomcat-7.0-doc/deployer-howto.html
