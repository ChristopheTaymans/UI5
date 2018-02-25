/**
 * Master controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.oData
 */

sap.ui.define(
	["ui5/overview/oData/controllers/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		'sap/m/MessageToast',
		"sap/ui/core/format/NumberFormat",
		"sap/ui/model/Context",
	],
	function(BaseController, SAPJsonModel, Filter, MessageToast, NumberFormat,ContextBinding) {
		"use strict";

		return BaseController.extend("ui5.overview.oData.controllers.Basket", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */

			onInit: function() {
				this.getRouter().getRoute("basketRoute").attachPatternMatched(this.onBasketRouteMatched, this);				
			},

			onBasketRouteMatched: function(oEvent) {			
				this.getView().setBindingContext(new ContextBinding(this.getModel(),"/BasketHeaderSet('')"));
			},

			_onDelete: function(oEvent) {				
				var oDataModel = this.getModel();
/// get path of the selected line to remove				
				var item = oEvent.getParameters('listItem').listItem;
				var sPath = item.getBindingContext().getPath();
				this.setBusy(true);
/// send a remove request				
				oDataModel.remove(sPath, {
					success: function() {
						this.setBusy(false);
						MessageToast.show(this.getText("DELETED"), {
							closeOnBrowserNavigation: false
						});
						oDataModel.refresh(true);
					}.bind(this),
					error: function(oError) {
						this.setBusy(false);						
						var errorTxt = JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorTxt, {
							closeOnBrowserNavigation: false
						});
					}.bind(this)
				});
			},

			_onSubmit: function(oEvent) {
/// quantity has changed in the quantity input field of the basket		
				var oDataModel = this.getModel();
/// get path of the current basket item				
				var sPath = oEvent.getSource().getBindingContext().getPath();
/// get the quantity and parse in integer ( entity in the model expect an integer 
/// in the quantity, if it is sent as string an errror occurs in the http request					
				var quantity = parseInt(oEvent.getParameter("value"));

/// send an update request 				
				oDataModel.update(sPath, {
					'Quantity': quantity
				}, {
					success: function(oData, response) {
						this.setBusy(false);
						oDataModel.refresh(true);
					}.bind(this),
					error: function(oError) {
						this.setBusy(false);
/// if update failed -> reset change in the current model..in othes word the initial quantity will be retored in the input field						
						oDataModel.resetChanges();
						var errorTxt = JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorTxt, {
							closeOnBrowserNavigation: false
						});
					}.bind(this),
					refreshAfterChange: false
				});

				
/// wz can also make modif by batch. since input field for quantity is directly bind to the model, every change are recorded and can be submited
/// issue, ui can't capture the error occuring in FM. the request is always succesfull even if error in FM				
				//            	oDataModel.submitChanges({                		
				//             		success: function(oData,response){ 
				//             			this.setBusy(false);    
				//             			oDataModel.refresh(true);
				//             			MessageToast.show(this.getText("SAVED"),{closeOnBrowserNavigation:false });             		  
				//                  	}.bind(this),                 	
				//             		error: function(oError){     
				//             			this.setBusy(false);
				//             			var errorTxt = JSON.parse(oError.responseText).error.message.value;  
				//             			MessageToast.show(errorTxt,{closeOnBrowserNavigation:false });              			
				//             		}.bind(this)
				//             	 }); 
			},

			_onProceed: function(oEvent) {				
				this.getRouter().navTo(
						"orderRoute"
					)
			},

			itemTotalPrice: function(quantity, price) {
				var numberFormat = NumberFormat.getFloatInstance({
					maxFractionDigits: 2,
					minFractionDigits: 2,
					groupingEnabled: true,
					groupingSeparator: ".",
					decimalSeparator: ","
				});
				return numberFormat.format(quantity * price);
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
			onExit: function() {}
		});
	}
);