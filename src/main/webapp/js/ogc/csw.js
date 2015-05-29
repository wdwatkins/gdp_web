// JSLint fixes
/*global _*/
/*global OpenLayers */

var GDP = GDP || {};

GDP.OGC = GDP.OGC || {};

GDP.OGC.CSW = function (args) {
	"use strict";
	args = args || {};
	this.url = args.url;

	/*
	 * @param {Object} args
	 *     @prop {String} outputSchema (optional) - output schema to be used to in the response.
	 *     @prop {Number} maxRecords (optional) - defaults to 1000
	 *     @prop {String} title (optional) - Filter by title property if this is set.
	 * @returns {jquery.Promise} - Resolves when request is successful and return the response object. Rejected
	 * if the request fails with the error message.
	 */
	this.requestGetRecords = function(args) {
		var outputSchema = args.outputSchema ? args.outputSchema : 'http://www.opengis.net/cat/csw/2.0.2';
		var maxRecords = args.maxRecords || 1000;
		var title = args.title || '';
		var deferred = $.Deferred();

		var cswGetRecFormat = new OpenLayers.Format.CSWGetRecords.v2_0_2();
		var query = {
			ElementSetName: {
				value: "full"
			}
		};
		var getRecRequest;

		if (title) {
			query.Constraint = {
				version : '1.1.0',
				Filter : new OpenLayers.Filter.Comparison({
						type : OpenLayers.Filter.Comparison.LIKE,
						property : 'title',
						value : title,
						matchCase : true
					})
				};
		}
		getRecRequest = cswGetRecFormat.write({
			resultType: "results",
			maxRecords: String(maxRecords),
			outputSchema: outputSchema,
			Query: query
		});

		OpenLayers.Request.POST({
			url: this.url,
			data: getRecRequest,
			success: function (response) {
				var cswGetRecRespObj = cswGetRecFormat.read(response.responseXML || response.responseText);
				deferred.resolve(cswGetRecRespObj);
			},
			failure: function (response) {
				deferred.reject(response);
			}
		});
		return deferred.promise();
	};

	this.requestGetRecordById = function(args) {
		var outputSchema = args.outputSchema ? args.outputSchema : 'http://www.opengis.net/cat/csw/2.0.2';
		var id = args.id;
		var cswGetRecFormat = new OpenLayers.Format.CSWGetRecords.v2_0_2();
		var deferred = $.Deferred();

		OpenLayers.Request.GET({
			url : this.url + '/',
			params : {
				request : 'GetRecordById',
				service : 'CSW',
				version : '2.0.2',
				resultType : 'results',
				id : id,
				outputSchema : outputSchema
			},
			success : function(response) {
				var respObj = cswGetRecFormat.read(response.responseXML);
				deferred.resolve(respObj);
			},
			failure : function(response) {
				deferred.reject(response);
			}
		});

		return deferred.promise();
	}
};