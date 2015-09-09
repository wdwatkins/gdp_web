/*global expect */
/*global $*/
/*global GDP */
/*global jasmine */

describe('WelcomeView', function() {

	var $testDiv;
	var view, templateSpy;

	beforeEach(function() {
		$('body').append('<div id="test-div"></div>');
		$testDiv = $('#test-div');

		$testDiv.html('<div class="welcome-jumbotron"></div>' +
			'<button class="toggle-welcome" title="Hide welcome"><i class="fa fa-angle-double-down"></i>'
		);

		templateSpy = jasmine.createSpy('templateSpy');

		$.fx.off = true;
	});

	afterEach(function() {
		$testDiv.remove();
		$.fx.off = false;
	});

	it('Expects that at initialization the template is called with the correct context if hide is not specified', function() {
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div'
		});
		expect(templateSpy).toHaveBeenCalledWith({
			button : view.SHOW_WELCOME,
			hide : false
		});
	});

	it('Expects that at initialization the template is called with the correct context if hide is set to true', function() {
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div',
			hide : true
		});
		expect(templateSpy).toHaveBeenCalledWith({
			button : view.HIDE_WELCOME,
			hide : true
		});
	});

	it('Expects that a call to toggleWelcome, toggles the visibility of the .welcome-jumbotron div and updates the toggle button', function() {
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div'
		});
		view.toggleWelcome();
		expect($('.welcome-jumbotron').is(':visible')).toBe(false);
		expect($('.toggle-welcome').attr('title')).toEqual(view.HIDE_WELCOME.buttonTitle);
		expect($('i').hasClass(view.HIDE_WELCOME.buttonIcon));

		view.toggleWelcome();
		expect($('.welcome-jumbotron').is(':visible')).toBe(true);
		expect($('.toggle-welcome').attr('title')).toEqual(view.SHOW_WELCOME.buttonTitle);
		expect($('i').hasClass(view.SHOW_WELCOME.buttonIcon));
	});

	it('Expects that a call to hideWelcome, hides the .welcome-jumbotron div and updates the toggle button', function() {
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div'
		});
		view.hideWelcome();
		expect($('.welcome-jumbotron').is(':visible')).toBe(false);
		expect($('.toggle-welcome').attr('title')).toEqual(view.HIDE_WELCOME.buttonTitle);
		expect($('i').hasClass(view.HIDE_WELCOME.buttonIcon));
	});

	it('Expects that a call to hideWelcome, hides the .welcome-jumbotron div and updates the toggle button', function() {
		view = new GDP.util.WelcomeView({
			template : templateSpy,
			el : '#test-div'
		});
		view.showWelcome();
		expect($('.welcome-jumbotron').is(':visible')).toBe(true);
		expect($('.toggle-welcome').attr('title')).toEqual(view.SHOW_WELCOME.buttonTitle);
		expect($('i').hasClass(view.SHOW_WELCOME.buttonIcon));
	});
});