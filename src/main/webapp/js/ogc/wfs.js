/* jslint browser: true*/
/* globals GDP.model.Config* */

var GDP = GDP || {};

GDP.OGC = GDP || {};


GDP.OGC.WFS = (function() {
    var capabilitiesCache;

    function _callWFS(data, async, successCallback) {
        var defaultData = {
            'service': 'WFS',
            'version': '1.1.0'
        }

        var wfsData = {};

        // Merge defaultData with data, putting results in wfsData. If there are
        // any conflicts, the property from data will overwrite the one in defaultData.
        $.extend(wfsData, defaultData, data);
        GDP.logger.debug('GDP: Calling WFS Service with a '+ wfsData.request + ' request.');
        var promise = $.ajax({
            url: GDP.config.get('application').endpoints.geoserver  + '/wfs',
            async: async,
            data: wfsData,
            cache: false,
            success: function(data, textStatus, jqXHR) {
                if (!$(data).find('ExceptionReport').length) {
                    if ('GetCapabilities' === wfsData.request) {
                        capabilitiesCache = data;
                    }
                } else {
                    alert('WFS endpoint did not provide a proper response.');
                }
                successCallback(data);
            }
        });
		return promise;
    }

	function _getBoundsFromCache(featureName) {
		var result;
		$(capabilitiesCache).find('FeatureType').each(function() {
			if ($(this).find('Name').text() === featureName) {
				var bbox = $(this).find('WGS84BoundingBox');
				var lowerCorner = $(bbox).find('LowerCorner').text().split(' ');
				var upperCorner = $(bbox).find('UpperCorner').text().split(' ');

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
		getBoundsFromCache : _getBoundsFromCache,
        cachedGetCapabilities: capabilitiesCache
    };
}());


