/* jslint browser: true*/
/* globals GDP.model.Config* */

var GDP = GDP || {};

GDP.OGC = GDP || {};


GDP.OGC.WFS = (function () {
	var capabilitiesCache;

	/*
	 * @param {Object} query parameters to be passed to the WFS call
	 * @param {String} method to be used for the request. Defaults to 'GET'
	 * @return jquery.Deferred.promise. If deferred is resolved it will return the data returned in the WFS call.
	 *     If the WFS returns an exception or fails, the deferred is rejected with an error message returned.
	 */
	function _callWFS(data, method) {
		var deferred = $.Deferred();
		var defaultData = {
			'service': 'WFS',
			'version': '1.1.0'
		}

		var wfsData = {};

		// Merge defaultData with data, putting results in wfsData. If there are
		// any conflicts, the property from data will overwrite the one in defaultData.
		$.extend(wfsData, defaultData, data);
		GDP.logger.debug('GDP: Calling WFS Service with a ' + wfsData.request + ' request.');
		$.ajax({
			url: GDP.config.get('application').endpoints.geoserver + '/wfs',
			method : (method) ? method : 'GET',
			data: wfsData,
			cache: false,
			success: function (data, textStatus, jqXHR) {
				if (GDP.util.findXMLNamespaceTags($(data), 'ows:ExceptionReport').length === 0) {
					if ('GetCapabilities' === wfsData.request) {
						capabilitiesCache = data;
					}
					deferred.resolve(data);
				} else {
					alert('WFS endpoint did not provide a proper response.');
					deferred.reject('WFS endpoint did not provide a proper response.');
				}
			},
			error : function(jqXHR, textStatus) {
				deferred.reject(textStatus);
			}
		});
		return deferred.promise();
	}

	function _getBoundsFromCache(featureName) {
		var result;
		$(capabilitiesCache).find('FeatureType').each(function () {
			if ($(this).find('Name').text() === featureName) {
				var bbox = GDP.util.findXMLNamespaceTags($(this), 'ows:WGS84BoundingBox');
				var lowerCorner = GDP.util.findXMLNamespaceTags($(bbox), 'ows:LowerCorner').text().split(' ');
				var upperCorner = GDP.util.findXMLNamespaceTags($(bbox),'ows:UpperCorner').text().split(' ');

				var minx = lowerCorner[0];
				var miny = lowerCorner[1];
				var maxx = upperCorner[0];
				var maxy = upperCorner[1];

				result = new OpenLayers.Bounds(minx, miny, maxx, maxy);
			}
		});
		return result;
	}

	return {
		callWFS: _callWFS,
		getBoundsFromCache: _getBoundsFromCache,
		cachedGetCapabilities: capabilitiesCache
	};
}());


