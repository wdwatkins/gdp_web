/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};
(function(){

    GDP.ADVANCED = GDP.ADVANCED || {};

    GDP.ADVANCED.model = GDP.ADVANCED.model || {};
    
    var Job = Backbone.Model.extend({
	defaults: {
	    dataSource : GDP.ADVANCED.model.dataSource,
	    //reference to the spatial extent on geoserver
	    featureCollection:[],

	    //ows identifier for the algorithm. Ex: gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm
	    algorithmId: null,
	    algorithmConfig: {
		featureAttributeName:null,
		requireFullCoverage:null,
		delimiter:null,
		summarizeTimestep:null,
		groupBy:null,
		statistics: [],
		sumarizeFeatureAttribute: null
	    }
	} 
    });
    GDP.ADVANCED.model.job = new Job();
}());