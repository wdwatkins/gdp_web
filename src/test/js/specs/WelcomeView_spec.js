/*global expect */
/*global $*/
/*global GDP */
/*global jasmine */

describe('WelcomeView', function() {

	var $testDiv;
	var view, templateSpy;

	beforeEach(function() {
		GDP.incomingParams = {};
		$('body').append('<div id="test-div"></div>');
		$testDiv = $('#test-div');

		$testDiv.html('<div class="welcome-content"></div>' +
			'<img class="toggleArrow" src="images/togglearrow-01.png" alt="toggle arrow"/>'
		);

		templateSpy = jasmine.createSpy('templateSpy');

		$.fx.off = true;
	});

	afterEach(function() {
		$testDiv.remove();
		$.fx.off = false;
	});

	it('Expects that a call to toggleWelcomeArea, toggles the visibility of the .welcome-content div and rotates arrow', function() {
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div'
		});
		view.toggleWelcomeArea();
		expect($('.welcome-content').is(':visible')).toBe(false);
		expect($('.toggleArrow').hasClass('rotate'));

		view.toggleWelcomeArea();
		expect($('.welcome-content').is(':visible')).toBe(true);
	});
});