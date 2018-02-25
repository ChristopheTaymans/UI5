sap.ui.define([
		"sap/ui/core/util/MockServer"
	], function (MockServer) {
		"use strict";	
		return {	
			/**
			 * Initializes the mock server.
			 * You can configure the delay with the URL parameter "serverDelay".
			 * The local mock data in this folder is returned instead of the real data for testing.
			 * @public
			 */
			init : function () {
				
				var oMockServer,
				_sAppModulePath = jQuery.sap.getModulePath("template01/Application"),
				_sJsonFilesModulePath = _sAppModulePath + "/localService/mockdata";				

				// get manifest data
			    var oManifest = jQuery.sap.syncGetJSON("manifest.json").data;
			    // get Odata datasource URL and build the URL for oData
				var oMainDataSource = oManifest["sap.app"].dataSources.oData;
				var sMetadataUrl = _sAppModulePath + oMainDataSource.settings.localUri;
			    // ensure there is a trailing slash
				var sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";
                // Create MockServer with Odata URL
				oMockServer = new MockServer({
					rootUri : sMockServerUrl
				});
				// configure mock server with a delay of 1s
				MockServer.config({
					autoRespond : true,
					autoRespondAfter : 1000
				});
				// load local mock data
				oMockServer.simulate(sMetadataUrl, {
//					sMockdataBaseUrl : _sJsonFilesModulePath,
					bGenerateMissingMockData : true
				});				
				oMockServer.start();
				jQuery.sap.log.info("Running the app with mock data");
			},

			/**
			 * @public returns the mockserver of the app, should be used in integration tests
			 * @returns {sap.ui.core.util.MockServer} the mockserver instance
			 */
			getMockServer : function () {
				return oMockServer;
			}
		};
	}
);