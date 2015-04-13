/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};
(function(){

    GDP.ADVANCED = GDP.ADVANCED || {};

    GDP.ADVANCED.model = GDP.ADVANCED.model || {};

    var Job = Backbone.Model.extend({
	defaults: {
	    //data detailsL
	    dataSourceUrl : null,
	    dataSourceVariables : new GDP.ADVANCED.model.DataSourceVariables(),
	    startDate: null,
	    endDate: null,
	    
	    //spatial details:
	    aoiName : '',
	    aoiAttribute : '',
	    aoiAttributeValues : [],
	    
	    //ows identifier for the algorithm. Ex: gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm
	    processes: new GDP.ADVANCED.collection.Processes(),
	    algorithmId: null,
	    featureAttributeName:null,
	    requireFullCoverage:null,
	    delimiter:null,
	    summarizeTimestep:null,
	    groupBy:null,
	    statistics: [],
	    sumarizeFeatureAttribute: null
	} 

    });
    GDP.ADVANCED.model.Job = Job;
}());