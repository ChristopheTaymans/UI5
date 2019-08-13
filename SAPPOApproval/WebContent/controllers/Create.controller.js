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

		return BaseController.extend("SAPPOApproval.Application.controllers.Create", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
			onInit: function () {
				this.getRouter().getRoute("createRoute").attachPatternMatched(this.onCreateRouteMatched, this);

			},	

			onCreateRouteMatched: function (oEvent) {
				this.setInfo("createMode",true);
				var oModel = this.getModel("main");
				var sParameter = oEvent.getParameter("arguments").path;
				var sBindingPath = '/' + sParameter;
				var oDetailBindingCtx = new ContextBinding(oModel, sBindingPath);
				this.getView().setBindingContext(oDetailBindingCtx, "main");						
			}
		});
	}
);