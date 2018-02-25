/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.routing
 */

sap.ui.define(
	["ui5/overview/oData/controllers/BaseController",
	 "ui5/overview/oData/controllers/BasketHelper",
		"sap/ui/model/Context",
		'sap/m/MessageToast',
	],
	function(BaseController, BasketHelper, ContextBinding, MessageToast) {
		"use strict";

		return BaseController.extend("ui5.overview.oData.controllers.Detail", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */

			onInit: function() {
				this.getRouter().getRoute("detailRoute").attachPatternMatched(this.onDetailRouteMatched, this);
				this.getRouter().getRoute("fullScreenRoute").attachPatternMatched(this.onDetailRouteMatched, this);
			},

			_goToFullScreen: function() {

				var oBindingContext = this.getView().getBindingContext();
				var path = encodeURIComponent(oBindingContext.sPath);
				this.setInfo('backButton', true);

				this.getRouter().navTo(
					"fullScreenRoute", {
						path: path
					}
				)
			},

			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 */
			onBeforeRendering: function() {},

			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * 
			 */
			onAfterRendering: function() {},

			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */
			onExit: function() {},

			onDetailRouteMatched: function(oEvent) {
				
/// bind the view with the product selected in the list				
				var oModel = this.getModel();
/// get the product path				
				var sParameter = oEvent.getParameter("arguments").path;
				var path = decodeURIComponent(sParameter); /// works only if the path is not encoded
///	create a binding context with the product path 			
				var oDetailBindingCtx = new ContextBinding(oModel, path);
/// assign the binding context to the view				
				this.getView().setBindingContext(oDetailBindingCtx);
			},
						

			_onAddToCart: function() {				
				/// get the product id 				
				var oDataModel = this.getModel();
/// get the binding context of the view				
				var oDetailBindingCtx = this.getView().getBindingContext();
/// get the value of productd id in the model via binding context				
				var Productid = oDataModel.getProperty('Productid', oDetailBindingCtx);
/// call the module to add product to basket				
				BasketHelper.addToCart(this, Productid);				
			},

			onNavButton: function() { ///redefined function from basecontroller
				this.setInfo('backButton', false);
				/// call the parent function            	 
				BaseController.prototype.onNavButton.apply();
			}
		});
	}
);