/**
 * Main application component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPPOApproval.Application
 */
sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/model/json/JSONModel",
		"SAPPOApproval/Application/controllers/ErrorHandler",
		"sap/ui/Device"
	],
	function (SAPUiComponent, SAPJsonModel, ErrorHandler, SAPDevice) {
		"use strict";

		$.sap.declare("SAPPOApproval.Application.Component");

		/**
		 * Definition of the component
		 */
		var oCmp = SAPUiComponent.extend("SAPPOApproval.Application.Component", {
			metadata: {
				manifest: "json"
			},


			init: function () {

				SAPUiComponent.prototype.init.apply(this, arguments);

				this.setModel(new SAPJsonModel({
					busy: false,
					toSave: false,
					createMode : false
				}), "Info");
				this.InitialLoaded = false;

				var oDeviceModel = new SAPJsonModel(SAPDevice);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.setModel(oDeviceModel, "DEVICE");
				this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
				this.getRouter().initialize();
			},

			destroy: function () {

				//this._oErrorHandler.destroy();
				// call the base component's destroy function
				SAPUiComponent.prototype.destroy.apply(this, arguments);
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass: function () {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!jQuery.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}


		});
		return oCmp;
	}
);