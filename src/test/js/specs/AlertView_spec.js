describe('GDP.util.AlertView', function() {

	beforeEach(function() {
		$('body').append('<div id="test-div"></div>');
	});

	afterEach(function() {
		$('#test-div').remove();
	});

	it('Expects that initialize creates the view but does not render it', function() {
		var testView = new GDP.util.AlertView({
			el : '#test-div'
		});

		expect(testView.$el).toEqual($('#test-div'));
		expect(testView.template).toBeDefined();
	});

	it('Expects that show set the alert class and message and renders the template', function() {
		var testView = new GDP.util.AlertView({
			el : '#test-div'
		});
		spyOn(testView, 'template').andCallThrough();

		testView.show('alert-danger', 'Danger message');
		expect(testView.template).toHaveBeenCalledWith({
			message : 'Danger message',
			alertClass : 'alert-danger'
		});
		expect($('#test-div .alert').length).toBe(1);
	});

	it('Expects that a second invocation of show removes the first alert and replaces with the seconde', function() {
		var testView = new GDP.util.AlertView({
			el : '#test-div'
		});
		spyOn(testView, 'template').andCallThrough();

		testView.show('alert-danger', 'Danger message');
		testView.show('alert-info', 'Info message');

		expect($('#test-div .alert').length).toBe(1);
	});

});