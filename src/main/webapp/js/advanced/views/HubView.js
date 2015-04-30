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
			var messages = this.model.readyForProcessing();
			var invalidJob = (messages.spatial.length !== 0) || (messages.dataDetails.length !== 0) || (messages.algorithm.length !== 0);
			this.$el.html(this.template({
				jobModel: this.model.attributes,
				selectedProcess : (process) ? process.attributes : '',
				processInputs : this.model.getProcessInputs(),
				messages : messages,
				invalidJob : invalidJob
			}));
		},

		initialize : function(options) {
			GDP.util.BaseView.prototype.initialize.apply(this, arguments);
			this.spatialMapView = new GDP.ADVANCED.view.HubSpatialMapView({
				model : this.model,
				mapDiv : 'hub-spatial-inset-map'
			});
		},

		remove : function() {
			this.spatialMapView.remove();
			GDP.util.BaseView.prototype.remove.apply(this, arguments);
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
