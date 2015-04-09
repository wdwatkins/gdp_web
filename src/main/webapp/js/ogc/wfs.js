/* jslint browser: true*/
/* globals GDP.model.Config* */

var GDP = GDP || {};

GDP.OGC = GDP || {};


GDP.OGC.WFS = function() {
    var _getCapabilities;

    function _callWFS(data, async, successCallback) {
        var defaultData = {
            'service': 'WFS',
            'version': '1.1.0'
        }

        var wfsData = {};

        // Merge defaultData with data, putting results in wfsData. If there are
        // any conflicts, the property from data will overwrite the one in defaultData.
        $.extend(wfsData, defaultData, data);
        logger.debug('GDP: Calling WFS Service with a '+ wfsData.request + ' request.');
        var promise = $.ajax({
            url: GDP.model.Config.get('endpoints').geoserver ,
            async: async,
            data: wfsData,
            cache: false,
            success: function(data, textStatus, jqXHR) {
                if (!$(data).find('ExceptionReport').length) {
                    if ('GetCapabilities' === wfsData.request) {
                        GDP.OGC.WFS.cachedGetCapabilities = data;
                    }
                } else {
                    alert('WFS endpoint did not provide a proper response.');
                }
                successCallback(data);
            }
        });
		return promise;
    }

    return {
        callWFS: _callWFS,
        cachedGetCapabilities: _getCapabilities
    };
};


