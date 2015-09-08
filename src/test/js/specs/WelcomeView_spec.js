/*global expect */
/*global $*/
/*global GDP */
/*global jasmine */

describe('WelcomeView', function() {

	var $testDiv;
	var view;

	beforeEach(function() {
		$('body').append('<div id="test-div"></div>');
		$testDiv = $('#test-div');

		$testDiv.html('<div class="welcome-jumbotron"></div>' +
			'<button class="toggle-welcome" title="Hide welcome"><i class="fa fa-angle-double-down"></i>'
		);

		templateSpy = jasmine.createSpy('templateSpy');

		$.fx.off = true;
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div'
		});
	});

	afterEach(function() {
		$testDiv.remove();
		$.fx.off = false;
	});

	it('Expects that a call to toggleWelcome, toggles the visibility of the .welcome-jumbotron div and updates the toggle button', function() {
		view.toggleWelcome();
		expect($('.welcome-jumbotron').is(':visible')).toBe(false);
		expect($('.toggle-welcome').attr('title')).toEqual('Show welcome');
		expect($('i').hasClass('fa-angle-double-up'));

		view.toggleWelcome();
		expect($('.welcome-jumbotron').is(':visible')).toBe(true);
		expect($('.toggle-welcome').attr('title')).toEqual('Hide welcome');
		expect($('i').hasClass('fa-angle-double-down'));
	});

});