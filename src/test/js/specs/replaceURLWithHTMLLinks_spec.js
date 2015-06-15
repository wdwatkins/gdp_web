/*global GDP*/
/*global expect*/

describe('GDP.util.replaceURLWIth HTMLLinks', function() {

	it('Expects a text input with no links to return the text as is', function() {
		var test = 'This is a test with no links';
		expect(GDP.util.replaceURLWithHTMLLinks(test)).toEqual(test);
		expect(GDP.util.replaceURLWithHTMLLinks(test, 10)).toEqual(test);
	});

	it('Expects a text input with one link to return the text with an html link included', function() {
		var test = 'This test contains http://server.com/1/example_page as a link';
		var result = GDP.util.replaceURLWithHTMLLinks(test);
		expect(result).toContain('This test contains <a href="http://server.com/1/example_page"');
		expect(result).toContain('>http://server.com/1/example_page</a>');
	});

	it('Expects a text input with two links to return the text with two html links included', function() {
		var test = 'This test contains http://server.com/1/example_page as a link, 2nd link is http://www.junk.com/index';
		var result = GDP.util.replaceURLWithHTMLLinks(test);
		expect(result).toContain('This test contains <a href="http://server.com/1/example_page"');
		expect(result).toContain('>http://server.com/1/example_page</a>');
		expect(result).toContain('<a href="http://www.junk.com/index"');
		expect(result).toContain('>http://www.junk.com/index</a>');
	});

	it('Expects a ftp protocol to also be converted to a link', function() {
		var test = 'This test contains ftp://server.com/1/example_page as a link';
		var result = GDP.util.replaceURLWithHTMLLinks(test);
		expect(result).toContain('This test contains <a href="ftp://server.com/1/example_page"');
		expect(result).toContain('>ftp://server.com/1/example_page</a>');
	});

	it('Expects that if the textLimit parameter is specified that the visible link name will be truncated', function() {
		var test = 'This test contains http://server.com/1/example_page as a link';
		var result = GDP.util.replaceURLWithHTMLLinks(test, 15);
		expect(result).toContain('This test contains <a href="http://server.com/1/example_page"');
		expect(result).toContain('>http://server.c...</a>');
	});
});