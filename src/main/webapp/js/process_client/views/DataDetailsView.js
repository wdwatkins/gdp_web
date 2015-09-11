/*jslint browser: true*/
/*global _,jQuery*/
var GDP = GDP || {};
(function(_, $){
    "use strict";
    GDP.PROCESS_CLIENT= GDP.PROCESS_CLIENT || {};
    GDP.PROCESS_CLIENT.view = GDP.PROCESS_CLIENT.view || {};
	var variablePicker  = {
		selector : '#data-source-vars'
    };
	var datePickers = {
		start : {
			selector:'#start-date'
		},
		end : {
			selector: '#end-date'
		}
	};
	var urlTextPicker = {
		selector: '#data-source-url'
	};

	var dataSourcePicker = {
		selector : '#data-source-select'
	};

    GDP.PROCESS_CLIENT.view.DataDetailsView = GDP.util.BaseView.extend({
	'events' : (function(){
		var ret = {};
		ret['change ' + variablePicker.selector] = 'setSelectedVariables';
		ret['change ' + urlTextPicker.selector] = 'setUrl';
		ret['change ' + dataSourcePicker.selector] = 'setUrl';
		ret['changeDate ' + datePickers.start.selector] = 'setStartDate';
		ret['changeDate ' + datePickers.end.selector] = 'setEndDate';
		ret['submit form'] = 'goToHubPage';
		return ret;
	}()),

	getDataSourceOptions : function() {
		var dataSourceUrl = this.model.get('dataSourceUrl');
		var dataSources = this.model.get('dataSetModel').get('dataSources');

		return _.map(dataSources, function(dataSource) {
			return {
				text : dataSource.title,
				value : dataSource.url,
				selected : dataSource.url === dataSourceUrl
			};
		});
	},

	getVariableOptions : function() {
		var dataVariables = this.model.get('dataVariables');
		var variableCollection = this.model.get('dataSourceModel').get('variables');
		return _.map(variableCollection.models, function(variableModel){
			var varAttributes = variableModel.attributes;
			return {
				text : varAttributes.name + ' - ' + varAttributes.description + ' (' + varAttributes.unitsstring + ")",
				value : varAttributes.name,
				selected : _.contains(dataVariables, varAttributes.name)
			};
		});
	},

	/*
	 *
	 * @param {Object} options
	 *     @prop {Function} template - returns a function which will render the template for this view
	 *     @prop {GDP.PROCESS_CLIENT.JobModel} model
	 *     @prop {String} datasetId,
	 */
	'initialize': function(options) {
		var self = this;
		//Fetch data set model
		var getDataSetModelPromise = this.model.updateDataSetModel(options.datasetId);
		var hasVariables = this.model.get('dataSourceModel').get('variables').length > 0;

		this.routePrefix = options.datasetId ? '#!catalog/gdp/dataset/' + options.datasetId : '#!advanced';

		this.context = this.model.attributes;
		this.context.hasDataSources = options.datasetId;

		//super
		GDP.util.BaseView.prototype.initialize.apply(self, arguments);

		if (options.datasetId) {
			this.dataSourceSelectMenuView = new GDP.util.SelectMenuView({
				sortBy : 'text',
				emptyPlaceholder : true,
				menuOptions : this.getDataSourceOptions(),
				el : '#data-source-select'
			});
		}

		this.variablesSelectMenuView = new GDP.util.SelectMenuView({
				el : variablePicker.selector,
				emptyPlaceholder : false,
				sortOptions: false,
				menuOptions : this.getVariableOptions()
		});
		if (hasVariables) {
			this.$(variablePicker.selector).prop('disabled', !hasVariables);
		}

		getDataSetModelPromise.done(function() {
			var dataSourceModel = self.model.get('dataSourceModel');

			self.listenTo(self.model, 'change:dataSourceUrl', self.changeUrl);
			self.listenTo(dataSourceModel, 'change:variables', self.updateVariables);
			self.listenTo(dataSourceModel, 'change:dateRange', self.changeDateRange);
			self.listenTo(self.model, 'change:dataVariables', self.changeVariables);
			self.listenTo(self.model, 'change:startDate', self.changeStartDate);
			self.listenTo(self.model, 'change:endDate', self.changeEndDate);

			self.dataSourceSelectMenuView.updateMenuOptions(self.getDataSourceOptions());
			self.updateVariables();
			self.changeVariables();

			self.changeStartDate();
			self.changeEndDate();

			// Set datePickers start and end dates
			self.updateStartEndDates(dataSourceModel.get('dateRange'));
		});
	},
	'setEndDate' : function(ev){
		ev.preventDefault();
		this.model.set('endDate', ev.target.value);
	},
	'setStartDate' : function(ev){
		ev.preventDefault();
		this.model.set('startDate', ev.target.value);
	},
	'setUrl' : function(ev){
		this.model.set('dataSourceUrl', ev.target.value);
	},
	/*
	 * Route back to the hub page.
	 * @param {Jquery event} ev
	 * @returns {undefined}
	 */
	goToHubPage : function(ev) {
		ev.preventDefault();
		this.router.navigate(this.routePrefix, {trigger : true});
	},

	setInputsDisabled : function(disabled) {
		this.$(urlTextPicker.selector).prop('disabled', disabled);
		this.$(dataSourcePicker.selector).prop('disabled', disabled);
		this.$(variablePicker.selector).prop('disabled', disabled);
		this.$(datePickers.start.selector).prop('disabled', disabled);
		this.$(datePickers.end.selector).prop('disabled', disabled);
	},

	changeUrl : function() {
		var self = this;
		var dataSourceUrl = this.model.get('dataSourceUrl');
		var dataSourceModel = this.model.get('dataSourceModel');

		this.$(dataSourcePicker.selector).val(dataSourceUrl);
		this.$(urlTextPicker.selector).val(dataSourceUrl);

		if (dataSourceUrl) {
			this.setInputsDisabled(true);

			dataSourceModel.fetch({
				dataSourceUrl : dataSourceUrl,
				allowCache : this.$('#use-cached-checkbox').is(':checked')
			}).fail(function(msg) {
				self.model.set('dataVariable', []);
				self.model.set('startDate', '');
				self.model.set('endDate', '');
				//TODO: better error handling
				GDP.logger.debug(msg);
				window.alert(msg);
			}).always(function() {
				self.setInputsDisabled(false);
			});
		}
		else {
			this.model.set('dataVariable', []);
			this.model.set('startDate', '');
			this.model.set('endDate', '');
		}
	},

	updateVariables : function() {
		var dataSourceModel = this.model.get('dataSourceModel');
		var variables = dataSourceModel.get('variables');
		var $variablePicker = this.$(variablePicker.selector);
		this.variablesSelectMenuView.updateMenuOptions(this.getVariableOptions());
		$variablePicker.prop('disabled', !variables.length);
	},

	updateStartEndDates : function(dateRange) {
		var $startDate = this.$(datePickers.start.selector);
		var $endDate = this.$(datePickers.end.selector);

		if (dateRange.start) {
			$startDate.datepicker('setStartDate', dateRange.start);
			$startDate.datepicker('setEndDate', dateRange.end);
		}

		if (dateRange.end) {
			$endDate.datepicker('setStartDate', dateRange.start);
			$endDate.datepicker('setEndDate', dateRange.end);
		}
	},

	changeDateRange : function() {
		var dateRange = this.model.get('dataSourceModel').get('dateRange');
		var $startDate = this.$(datePickers.start.selector);
		var $endDate = this.$(datePickers.end.selector);

		$startDate.prop('disabled', !dateRange.start);
		$endDate.prop('disabled', !dateRange.end);

		this.updateStartEndDates(dateRange);

		this.model.set('startDate', dateRange.start);
		this.model.set('endDate', dateRange.end);
	},

	changeVariables : function() {
		this.$(variablePicker.selector).val(this.model.get('dataVariables'));
	},

	'changeStartDate' : function(){
		var startDate = this.model.get('startDate');
		var $startDate = this.$(datePickers.start.selector);

		if ('' === startDate){
			$startDate.datepicker('clearDates');
		}
		else{
			this.$(datePickers.end.selector).datepicker('setStartDate', startDate);
			$startDate.datepicker('setDate', startDate);
		}
	},
	'changeEndDate' : function(){
		var endDate = this.model.get('endDate');
		var $endDate = this.$(datePickers.end.selector);

		if('' === endDate){
			$endDate.datepicker('clearDates');
		}
		else{
			this.$(datePickers.start.selector).datepicker('setEndDate', endDate);
			$endDate.datepicker('setDate', endDate);
		}
	},

	'render' : function () {
		this.$el.html(this.template(this.context));
		this.selectMenuView = new GDP.util.SelectMenuView({
				el : variablePicker.selector,
				emptyPlaceholder : false,
				sortOptions: false
		});
		this.$(datePickers.start.selector).datepicker({
			format : 'm/d/yyyy'
		});
		this.$(datePickers.end.selector).datepicker({
			format : 'm/d/yyyy'
		});
		return this;
	},

	remove : function() {
		this.dataSourceSelectMenuView.remove();
		this.variablesSelectMenuView.remove();
		GDP.util.BaseView.prototype.remove.apply(this, arguments);

	},

	'setSelectedVariables' : function (ev) {
		this.model.set('dataVariables', this.$(variablePicker.selector).val());
	}
});

}(_, jQuery));
