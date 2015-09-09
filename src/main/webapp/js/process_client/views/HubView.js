/*jslint browser: true*/
/*global Backbone*/
/*global _*/

var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

GDP.PROCESS_CLIENT.view = GDP.PROCESS_CLIENT.view || {};

(function() {
	"use strict";
	GDP.PROCESS_CLIENT.view.HubView = GDP.util.BaseView.extend({

		EMAIL_WHEN_FINISHED_ALGORITHM : 'gov.usgs.cida.gdp.wps.algorithm.communication.EmailWhenFinishedAlgorithm',

		events: {
			'click #edit-spatial-btn' : 'goToSpatialPage',
			'click #edit-detail-btn' : 'goToDataDetailsPage',
			'click #edit-process-btn' : 'goToProcessPage',
			'click #submit-job-btn' : 'submitProcessingRequest',
			'click #retrieve-output-btn' : 'downloadResults',
			'click #retrieve-input-btn' : 'downloadProcessInputs'
		},

		render: function () {
			var process = this.model.getSelectedAlgorithmProcess();
			var messages = this.model.jobErrorMessages();
			var invalidJob = (messages.spatial.length !== 0) || (messages.dataDetails.length !== 0) || (messages.algorithm.length !== 0);

			this.$el.html(this.template({
				jobModel: this.model.attributes,
				areAllAOIVariablesSelected : this.model.attributes.aoiAttributeValues === this.model.SELECT_ALL_AOI_ATTRIBUTE_VALUES,
				selectedProcess : (process) ? process.attributes : '',
				processInputs : this.model.getProcessInputs(),
				messages : messages,
				invalidJob : invalidJob
			}));


		},

		/*
		 * @constructs
		 * @param {Object} -
		 *      @prop {Function} template - page template function
		 *      @prop {Function} metadataTemplate - template to be used to render the metadat tile contents
		 *      @prop {Function} wps - instance of the GDP.OGC.wps function
		 *      @prop {Object} model - instance of GDP.PROCESS_CLIENT.model.JobModel
		 *      @prop {String} datasetId - can be null .
		 */

		initialize : function(options) {
			var self = this;
			this.wps = options.wps;
			this.routePrefix = options.datasetId ? '#!catalog/gdp/dataset/' + options.datasetId  : '#!advanced';

			GDP.util.BaseView.prototype.initialize.apply(this, arguments);
			this.childViews = {};
			this.childViews.welcomeView = new GDP.util.WelcomeView({
				template : GDP.PROCESS_CLIENT.templates.getTemplate('welcome'),
				el : '.welcome-view-container',
				hide : this.model.get('dataSetModel') !== null
			});

			this.childViews.alertView = new GDP.util.AlertView({
				el : '#job-processing-messages-div'
			});

			// Used to store retrieval results id
			this.resultsModel = new Backbone.Model();

			this.model.updateDataSetModel(options.datasetId).fail(function(response) {
				self.childViews.alertView.show('alert-danger', 'Unable to load information about the dataset, ' + options.datasetId);
				GDP.logger.error('Could not GetRecordsById for ' + options.datasetId);
			}).always(function() {
				var datasetModel = self.model.get('dataSetModel');
				var dataSources = datasetModel.get('dataSources');
				var $metadataTile = self.$el.find('#dataset-metadata-wrapper');

				self.$el.find('.loading-indicator').hide();
				self.childViews.welcomeView.hideWelcome();
				self.$el.find('.hub-tile').show();
				self.childViews.spatialMapView = new GDP.PROCESS_CLIENT.view.HubSpatialMapView({
					model : self.model,
					mapDiv : 'hub-spatial-inset-map'
				});

				if (dataSources.length === 1 && (!self.model.get('dataSourceUrl'))) {
					// Set the dataSourceUrl in the job model.
					self.model.set('dataSourceUrl', dataSources[0].url);
					self.model.set('invalidDataSourceUrl', false);
					self.$('.data-source-url-selection').html(dataSources[0].url);
				}

				if (datasetModel.has('identifier')) {
					$metadataTile.find('.panel-body').html(options.metadataTemplate(datasetModel.attributes));
				}
				else {
					$metadataTile.hide();
				}
			});
		},

		remove : function() {
			_.each(this.childViews, function(view) {
				view.remove();
			});

			GDP.util.BaseView.prototype.remove.apply(this, arguments);
			return this;
		},

		goToSpatialPage : function(ev) {
			ev.preventDefault();
			this.router.navigate(this.routePrefix + '/spatial', {trigger : true});
		},

		goToDataDetailsPage : function(ev) {
			ev.preventDefault();
			this.router.navigate(this.routePrefix + '/datadetail', {trigger : true});
		},

		goToProcessPage : function(ev) {
			ev.preventDefault();
			this.router.navigate(this.routePrefix + '/process', {trigger: true});
		},

		setEditable : function(editable) {
			$('#edit-spatial-btn').prop('disabled', !editable);
			$('#edit-detail-btn').prop('disabled', !editable);
			$('#edit-process-btn').prop('disabled', !editable);
		},

		/*
		 * Forms the web processing service call from the jobModel and submits it. Continues
		 * to poll for status and results and updates the view as needed. This function returns as soon
		 * as the set up for the initial Web processing service is made. Uses deferreds to handle the asynchronous
		 * calls.
		 */
		submitProcessingRequest : function() {
			var executePromise;
			var mimeType = this.model.getMimeType();

			var self = this;

			var xmlInputs = this.model.getWPSXMLInputs();
			var getWPSStringInputs = this.model.getWPSStringInputs();

			var submitDone = $.Deferred();

			GDP.logger.debug("Starting submission process");

			this.setEditable(false);
			$('#submit-job-btn').prop('disabled', true);

			$.when(getWPSStringInputs).done(function(wpsStringInputs) {
				// We now have all the information we need to get started
				self.childViews.alertView.show('alert-info', 'Process status: started');

				executePromise = self.wps.sendWpsExecuteRequest(
					GDP.config.get('application').endpoints.processWps + '/WebProcessingService',
					self.model.get('algorithmId'),
					wpsStringInputs,
					['OUTPUT'],
					true,
					{
						'FEATURE_COLLECTION' : [self.wps.createWfsWpsReference(GDP.config.get('application').serviceEndpoints.wfs, xmlInputs)]
					},
					false,
					'xml',
					mimeType
				);

				executePromise.done(function(xml) {
					// Initial Web Processing service call made. Start polling for status and then resolve/reject the submitDone deferred
					// when the process is done or has failed.
					var intervalId;
					var statusCallback = function(xmlText) {
						// Workaround and extra logging for bug where empty xml is returned.
						// Ignore it and keep rechecking.
						var xml;

						if (!xmlText || xmlText === '') {
							GDP.logger.warn('GDP: RetrieveResultServlet returned empty response. Retrying.');
							return;
						}
						xml = $.parseXML(xmlText);

						if ($(xml).find('wps\\:ProcessStarted, ProcessStarted').length > 0) {
							GDP.logger.debug('GDP Status: Process started');
							self.childViews.alertView.show('alert-info', 'Process status: in progess. Last checked: ' + (new Date()).toTimeString());
						}
                                                else if ($(xml).find('wps\\:ProcessAccepted, ProcessAccepted').length > 0) {
                                                        GDP.logger.debug('GDP Status: Process accepted');
							self.childViews.alertView.show('alert-info', 'Process status: in queue. Last checked: ' + (new Date()).toTimeString());
						}
						else if ($(xml).find('wps\\:ProcessSucceeded, ProcessSucceeded').length > 0) {
							window.clearInterval(intervalId);
							self.childViews.alertView.show('alert-success', 'Process status: complete');
							var outputURL = $(xml).find('wps\\:Output, Output').find('wps\\:Reference, Reference').attr('href');
							var outputURLAndData = outputURL.split('?');
							self.resultsModel.set({
								'outputURL' : outputURLAndData[0],
								'outputData' : outputURLAndData[1]
							});
							submitDone.resolve();
						}
						else if ($(xml).find('wps\\:ProcessFailed, ProcessFailed').length > 0) {
							window.clearInterval(intervalId);
							var message = 'GDP: STATUS: Process Failed: ' + $(xml).find('wps\\:ProcessFailed, ProcessFailed').find('ows\\:ExceptionText, ExceptionText').text();
							self.childViews.alertView.show('alert-danger', 'Process failed: ' + message);
							GDP.logger.warn('GDP: STATUS: Process failed: ' + message);
							submitDone.reject();
						}
						else {
							GDP.logger.warn('GDP: Status: Bad response received');
							self.childViews.alertView.show('alert-info', 'Process status: Unknown response received. Retrying, Last checked: ' + (new Date()).toTimeString());
						}
					};
					var statusLocation = $(xml).find('wps\\:ExecuteResponse, ExecuteResponse').attr('statusLocation');
					var statusID = (statusLocation.split('?')[1]).split('id=')[1];
					self.resultsModel.set('statusId', statusID);

					// If user would like to be notified by email send an additional execute request
					var email = self.model.get('email');
					var filename;
					var emailWPSInputs;
					if (email) {
						emailWPSInputs = {
							'wps-checkpoint' : [statusLocation],
							'email' : [email]
						};
						filename = self.model.get('filename');
						if (filename) {
							emailWPSInputs.filename = [filename];
						}

						self.wps.sendWpsExecuteRequest(
							GDP.config.get('application').endpoints.utilityWps + '/WebProcessingService',
							self.EMAIL_WHEN_FINISHED_ALGORITHM,
							emailWPSInputs,
							['result'],
							false
						).fail(function(xhr, textStatus, errorMessages) {
							self.childViews.alertView.show('alert-warning', 'Request for email notification failed : ' + textStatus);
						});
					}

					intervalId = window.setInterval(function() {
						$.ajax({
							url: GDP.config.get('application').endpoints.processWps + '/RetrieveResultServlet',
							data : {
								'id': statusID
							},
							success : function (data, textStatus, XMLHttpRequest) {
								statusCallback(XMLHttpRequest.responseText);
							},
							error : function(jqXHr, textStatus) {
								self.childViews.alertView.show('alert-warning', 'Status request error with ' + textStatus + '. Retrying, Last checked: ' + (new Date()).toTimeString());
							}
						});
					}, 5000);
				}).fail(function(jqXhr, errorThrown, errorMessage) {
					self.childViews.alertView.show('alert-danger', 'Process status: Failed with ' + errorMessage);
					submitDone.reject();
				});
			});

			// Processing is done or has failed. Update the view.
			submitDone.always(function() {
				self.setEditable(true);
			}).done(function() {
				$('#job-processing-div').hide();
				$('#job-results-div').show();
			}).fail(function() {
				$('#submit-job-btn').prop('disabled', false);
			});
		},

		downloadResults : function() {
			var url = this.resultsModel.get('outputURL');
			var data = this.resultsModel.get('outputData');
			var filename = this.model.get('filename');
			var data = data + ((filename) ? '&filename=' + filename : '');
			$.download(url, data, 'get');
		},

		downloadProcessInputs : function() {
			var url = this.resultsModel.get('outputURL');
			var statusId = this.resultsModel.get('statusId');
			var data = 'id=' + statusId + '&attachment=true';
			$.download(url, data, 'get');
		}
	});
}());
