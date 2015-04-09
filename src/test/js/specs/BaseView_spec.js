describe ('GDP.util.BaseView', function() {

	var templateSpy;

	beforeEach(function() {
		templateSpy = jasmine.createSpy('templateSpy');
	});

	it('Expects a context property to be used when rendering a view', function() {
		var NewView = GDP.util.BaseView.extend({
			context : {a : 'this'}
		});
		var view = new NewView({
			template : templateSpy
		});
		expect(templateSpy).toHaveBeenCalledWith({a : 'this'});
	});

	it('Expects a context option to be added to the context property', function() {
		var NewView = GDP.util.BaseView.extend({
			context : {a : 'this'}
		});
		var view = new NewView({
			context : {b : 'that'},
			template : templateSpy
		});
		expect(view.context).toEqual({a : 'this', b : 'that'});
		expect(templateSpy).toHaveBeenCalledWith({a : 'this', b : 'that'});
	});

});