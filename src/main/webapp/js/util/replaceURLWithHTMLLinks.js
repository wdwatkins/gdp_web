var GDP = GDP || {};

GDP.util = GDP.util || {};

// http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
GDP.util.replaceURLWithHTMLLinks = function(text, textLimit) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var result = text;
	var searchIndex = 0;
	var linksArray;

	if (text && text.toLowerCase().indexOf('noreplace') === -1) {
		result = text.replace(exp, '<a href="$1" target="_blank">$1</a>');
		if (textLimit && result.indexOf('</a>') !== -1) {
			// Find links and shorten them to textLimit
			linksArray = result.split('</a>');
			linksArray = _.map(linksArray, function(linkStr) {
				var startTagIndex = linkStr.lastIndexOf('>') + 1;
				var linkText = linkStr.substring(startTagIndex);
				if (linkText.length > textLimit) {
					linkText = linkText.substr(0, textLimit) + '...';
				}
				return linkStr.substring(0, startTagIndex) + linkText;
			});
			result = linksArray.join('</a>');
		}

		return result;
	} else {
		return result;
	}
};


