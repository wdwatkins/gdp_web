var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.view = GDP.ADVANCED.view || {};

(function() {
	"use strict";
	GDP.ADVANCED.view.HubView = GDP.util.BaseView.extend({

		events: {
			'click #edit-spatial-btn' : 'goToSpatialPage',
			'click #edit-detail-btn' : 'goToDataDetailsPage',
			'click #edit-process-btn' : 'goToProcessPage'
		},

		render: function () {
			var process = this.model.getSelectedAlgorithmProcess();
			this.$el.html(this.template({
				jobModel: this.model.attributes,
				selectedProcess : (process) ? process.attributes : '',
				processInputs : this.model.getProcessInputs()
			}));
		},

		goToSpatialPage : function() {
			this.router.navigate('/spatial', {trigger : true});
		},

		goToDataDetailsPage : function() {
			this.router.navigate('/datadetail', {trigger : true});
		},

		goToProcessPage : function() {
			this.router.navigate('/process', {trigger: true});
		}
});

}());
