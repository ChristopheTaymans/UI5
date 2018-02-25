sap.ui.define([
		"be/infra/sap/mobile/devicelist/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("be.infra.sap.mobile.devicelist.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);