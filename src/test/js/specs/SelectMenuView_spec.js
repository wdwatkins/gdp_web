describe('GDP.util.SelectMenuView', function() {

	describe('Tests without a placeholder', function() {

		beforeEach(function() {
			$('body').append('<select id="test-select"></select');
		});

		afterEach(function() {
			$('#test-select').remove();
		});

		it('Expects the view\'s $el property to equal the select menu', function() {
			var testView = new GDP.util.SelectMenuView({
				el : '#test-select',
				menuOptions: ['Smith', 'Jones', 'Olsen']
			});
			expect(testView.$el).toEqual($('#test-select'));
		});

		it('Expects a select menu view to contain the options specified', function() {
			var testView = new GDP.util.SelectMenuView({
				el : '#test-select',
				menuOptions: ['Smith', 'Jones', 'Olsen']
			});
			var $options = $('#test-select option');
			expect($options.length).toBe(3);
			expect($('#test-select option:nth-child(1)').val()).toEqual('Smith');
			expect($('#test-select option:nth-child(2)').val()).toEqual('Jones');
			expect($('#test-select option:nth-child(3)').val()).toEqual('Olsen');

			expect($('#test-select option:nth-child(1)').html()).toEqual('Smith');
			expect($('#test-select option:nth-child(2)').html()).toEqual('Jones');
			expect($('#test-select option:nth-child(3)').html()).toEqual('Olsen');
		});

		it('Expects a sorted menu if sortOptions is set to true', function() {
			var testView = new GDP.util.SelectMenuView({
				el : '#test-select',
				menuOptions: ['Smith', 'Jones', 'Olsen'],
				sortOptions : true
			});

			expect($('#test-select option:nth-child(1)').val()).toEqual('Jones');
			expect($('#test-select option:nth-child(2)').val()).toEqual('Olsen');
			expect($('#test-select option:nth-child(3)').val()).toEqual('Smith');
		});

		it('Expects the menu to be updated when updateMenuOptions is called', function() {
			var testView = new GDP.util.SelectMenuView({
				el : '#test-select',
				menuOptions: ['Smith', 'Jones', 'Olsen']
			});
			testView.updateMenuOptions(['1', '2', '3']);
			expect($('#test-select option:nth-child(1)').val()).toEqual('1');
			expect($('#test-select option:nth-child(2)').val()).toEqual('2');
			expect($('#test-select option:nth-child(3)').val()).toEqual('3');
		});
	});

	describe('Tests with an empty placeholder', function() {
		beforeEach(function() {
			$('body').append('<select id="test-select"><option></option></select');
		});

		afterEach(function() {
			$('#test-select').remove();
		});

		it('Expects the placeholder to be preserved when creating and updating the menu', function() {
			var testView = new GDP.util.SelectMenuView({
				el : '#test-select',
				menuOptions: ['Smith', 'Jones', 'Olsen'],
				emptyPlaceholder : true
			});

			expect($('#test-select option').length).toBe(4);
			expect($('#test-select option:nth-child(1)').val()).toEqual('');
			expect($('#test-select option:nth-child(2)').val()).toEqual('Smith');
			expect($('#test-select option:nth-child(3)').val()).toEqual('Jones');
			expect($('#test-select option:nth-child(4)').val()).toEqual('Olsen');
		});
	});
});