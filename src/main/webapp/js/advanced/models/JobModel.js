/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.model = GDP.ADVANCED.model || {};

GDP.ADVANCED.model.Job = Backbone.Model.extend({
    defaults: {
	dataSource : new GDP.ADVANCED.model.DataSourceVariable,
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