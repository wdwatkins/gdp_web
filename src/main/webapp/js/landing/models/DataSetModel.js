/*jslint browser: true*/
/*global Backbone*/
/*global _*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.models = GDP.LANDING.models || {};

(function() {
	"use strict";

	GDP.LANDING.models.DataSetModel = Backbone.Model.extend({
		defaults : {
			csw : {},
			isoMetadata : {}
		},

		/*
		 * @return {Array of Object} where
		 *	@prop {String} url - data source url
		 *	@prop {String} name - operations meta data name
		 *	@prop {String} title - identifying title of data source.
		 */
		getDataSources : function() {
			var metadata = this.get('isoMetadata');
			var getCharValue = this._getCharValue;

			var isOpeNDAP = function(charValue) {
				return (getCharValue(charValue).toLowerCase() === 'opendap');
			};
			var results = [];
			var operationMetaData;

			if (metadata) {
				// Look in identificationInfo for datasources first
				if (_.has(metadata, 'identificationInfo') && metadata.identificationInfo.length > 0) {
					_.each(metadata.identificationInfo, function(info) {
						if (_.has(info, 'serviceIdentification') && isOpeNDAP(info.serviceIdentification.operationMetadata.name)) {
							operationMetaData = info.serviceIdentification.operationMetadata;
							results.push({
								url : operationMetaData.linkage.URL,
								name : getCharValue(operationMetaData.name),
								title : getCharValue(info.serviceIdentification.citation.title)
							});
						}
					});
					// If no datasources found in identificationInfo, look in distributionInfo
					if (results.length === 0 && _.has(metadata, 'distributionInfo') && _.has(metadata.distributionInfo, 'transferOptions')) {
						_.each(metadata.distributionInfo.transferOptions, function(transferOption) {
							var online = transferOption.online[0];
							if (isOpeNDAP(online.name)) {
								results.push({
									url : online.linkage.URL,
									name : getCharValue(online.name),
									title : getCharValue(metadata.identificationInfo[0].citation.title)
								});
							}
						});
					}
				}
			}
			return results;
		},

		/*
		 * @return {Object} or null.
		 *     @prop {Array of String or null} emails
		 *     @prop {String or null} name
		 *     @prop {String or null} orgName
		 *     @prop {Object or null} role
		 */
		getContactInfo : function() {
			var metadata = this.get('isoMetadata');
			var getCharValue = this._getCharValue;
			return _.map(metadata.contact, function(c) {
				if (_.isEmpty(c)) {
					return null;
				}
				else {
					var emails, name, orgName, role;
					if (_.has(c, 'contactInfo') &&
						_.has(c.contactInfo, 'address') &&
						_.has(c.contactInfo.address, 'electronciMailAddress')) {
						emails = _.map(c.contactInfo.address.electronicMailAddress, getCharValue);
					}
					if (_.has(c, 'individualName')) {
						name = getCharValue(c.individualName);
					}
					if (_.has(c, 'organisationName')) {
						orgName = getCharValue(c.organisationName);
					}
					if (_.has(c, 'role')) {
						role = c.role;
					}
					return {
						emails : emails,
						name : name,
						orgName : orgName,
						role : role
					};
				}
			});
		},

		/*
		 * returns {Object or null}
		 *     @prop {String} start
		 *     @prop {String} end
		 */
		getDataSetTimeRange : function() {
			var metadata = this.get('isoMetadata');

			if (_.has(metadata, 'identificationInfo') && (metadata.identificationInfo.length > 0) &&
				(metadata.identificationInfo[0].extent.length > 0) &&
				(_.has(metadata.identificationInfo[0].extent[0], 'temporalElement')) &&
				(metadata.identificationInfo[0].extent[0].temporalElement.length > 0)){
				var time = metadata.identificationInfo[0].extent[0].temporalElement[0].extent.TimePeriod;
				return {
					start : time.beginPosition,
					end : time.endPosition
				};
			}
			else {
				return null;
			}
		},

		/*
		 * @return {Object or null}
		 *     @prop {String} description
		 *	   @prop {String} url
		 *	   @prop {String} name
		 */
		getDistributionTransferOptions : function() {
			var metadata = this.get('isoMetadata');
			var online;
			if (_.has(metadata, 'distributionInfo') &&
				(_.has(metadata.distributionInfo, 'distributor')) &&
				(metadata.distributionInfo.distributor.length > 0) &&
				(_.has(metadata.distributionInfo.distributor[0], 'distributoTransferOptions')) &&
				(metadata.distributionInfo.distributor[0].distributorTransferOptions.length > 0)  &&
				(metadata.distributionInfo.distributor[0].distributorTransferOptions[0].onLine.length > 0)) {
				online = metadata.distributionInfo.distributor[0].distributorTransferOptions[0].onLine[0];
				return {
					description : this._getCharValue(online.description),
					url : online.linkage.URL,
					name : this._getCharValue(online.name)
				}
			}
			else {
				return null;
			}
		},

		_getCharValue : function(obj) {
			if (obj) {
				return obj.CharacterString.value;
			}
			else {
				return null;
			}

		}
	});

	GDP.LANDING.models.DataSetCollection = Backbone.Collection.extend({
		model : GDP.LANDING.models.DataSetModel
	});
}());


