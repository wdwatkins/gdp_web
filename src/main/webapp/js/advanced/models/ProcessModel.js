/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.model = GDP.model || {};

GDP.model.Process = Backbone.Model.extend({
    defaults: {
	dataSource : new GDP.model.DataSource,
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