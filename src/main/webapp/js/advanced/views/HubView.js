var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.view = GDP.ADVANCED.view || {};

(function() {
	"use strict";
	GDP.ADVANCED.view.HubView = GDP.util.BaseView.extend({

		events: {
			'click #edit-spatial-btn' : 'goToSpatialPage',
			'click #edit-detail-btn' : 'goToDataDetailsPage',
			'click #edit-process-btn' : 'goToProcessPage',
			'click #submit-job-btn' : 'submitProcessingRequest'
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
			this.wps = new GDP.OGC.WPS(GDP.logger);
			GDP.util.BaseView.prototype.initialize.apply(this, arguments);
			this.spatialMapView = new GDP.ADVANCED.view.HubSpatialMapView({
				model : this.model,
				mapDiv : 'hub-spatial-inset-map'
			});
			this.alertView = new GDP.util.AlertView({
				el : '#job-processing-messages-div'
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
		},

		submitProcessingRequest : function() {
			var executePromise;
			var mimeType = this.model.getMimeType();

			var self = this;

			GDP.logger.debug("Starting submission process");

			var getWPSXMLInputs = this.model.getWPSXMLInputs();
			var getWPSStringInputs = this.model.getWPSStringInputs();

			$.when(getWPSXMLInputs, getWPSStringInputs).done(function(xmlInputs, wpsStringInputs) {
				self.alertView.show('alert-info', 'Process status: Started');

				executePromise = self.wps.sendWpsExecuteRequest(
					GDP.config.get('application').endpoints.processWps + '/WebProcessingService',
					self.model.get('algorithmId'),
					wpsStringInputs,
					['OUTPUT'],
					true,
					{
						'FEATURE_COLLECTION' : [self.wps.createWfsWpsReference(GDP.config.get('application').serviceEndpoints.geoserver + '/wfs', xmlInputs)]
					},
					false,
					'xml',
					mimeType
				);

				executePromise.done(function(xml) {
					var statusCallback = function(xmlText, intervalID, statusID) {
						// Workaround and extra logging for bug where empty xml is returned.
						// Ignore it and keep rechecking.
						var xml;

						if (!xmlText || xmlText === '') {
							logger.warn('GDP: RetrieveResultServlet returned empty response. Retrying.');
							return;
						}
						xml = $.parseXML(xmlText);

						if (!self.wps.checkWpsResponse(xml)) {
							if ($(xml).find('ProcessStarted').length > 0) {
								GDP.logger.debug('GDP Status: Process started');
								self.alertView.show('alert-info', 'Process status: checking status. Last checked: ' + (new Date()).toTimeString());
							}
							else if ($(xml).find('ProcessSucceeded').length > 0) {
								window.clearInterval(intervalId);
								self.alertView.show('alert-info', 'Process complete!');
							}
							else if ($(xml).find('ProcessFailed').length > 0) {
								window.clearInterval(intervalId);
								var message = 'GDP: STATUS: Process Failed: ' + $(xml).find('ProcessFailed').find('ExceptionText').text();
								self.alertView.show('alert-warning', 'Process failed: ' + message);
								GDP.logger.warn('GDP: STATUS: Process failed: ' + message);
							}
							else {
								GDP.logger.warn('GDP: Status: Bad response received');
								self.alertView.show('alert-info', 'Process status: Unknown response received. Retrying, Last checked: ' + (new Date()).toTimeString());
							}
						}
						else {
							window.clearInterval(intervalId);
							self.alertView.show('alert-info', 'GDP: Status Process Failed');
						}
					};
					var statusLocation = $(xml).find('ExecuteResponse').attr('statusLocation');
					var statusID = (statusLocation.split('?')[1]).split('id=')[1];
					var intervalId = window.setInterval(function() {
						$.ajax({
							url: GDP.config.get('application').endpoints.processWps + '/RetrieveResultServlet',
							data : {
								'id': statusID
							},
							success : function (data, textStatus, XMLHttpRequest) {
								statusCallback(XMLHttpRequest.responseText);
							},
							error : function() {
								self.alertView.show('alert-warning', 'Status request error. Submission failed');
								window.clearInterval(intervalId);
							}
						});
					}, 5000);
				}).fail(function(jqXhr, errorThrown, errorMessage) {
					self.alertView.show('alert-warning', 'Process status: Failed with ' + errorMessage);
				});
			});
		}
	});
}());
