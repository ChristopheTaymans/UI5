/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPPOApproval.Application
 */


sap.ui.define(
	["SAPPOApproval/Application/controllers/BaseController",
		"sap/ui/model/Context",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/routing/History"
	],
	function (BaseController, ContextBinding, SAPJsonModel, MessageToast, MessageBox, History) {
		"use strict";

		return BaseController.extend("SAPPOApproval.Application.controllers.Detail", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */

			onInit: function () {
				this.getRouter().getRoute("detailRoute").attachPatternMatched(this.onDetailRouteMatched, this);

			},

			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */
			onExit: function () {},

			onDetailRouteMatched: function (oEvent) {
				var oModel = this.getModel("main");
				var sParameter = oEvent.getParameter("arguments").path;
				var sBindingPath = '/' + sParameter;
				var oDetailBindingCtx = new ContextBinding(oModel, sBindingPath);
				this.getView().setBindingContext(oDetailBindingCtx, "main");
			},

			onDelete: function () {
var oModel = this.getModel("main");		
				oModel.remove(this.getView().getBindingContext("main").getPath(), {
					groupId: "changes"
				});
				this.setInfo("toSave",true);
				this.getRouter().navTo("initialRoute");
			},
		});
	}
);