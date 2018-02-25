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
		'sap/m/MessageBox',
		"sap/ui/core/format/NumberFormat",
		"sap/ui/model/Context",
	],
	function(BaseController, SAPJsonModel, Filter, MessageToast, MessageBox, NumberFormat,ContextBinding) {
		"use strict";

		return BaseController.extend("ui5.overview.oData.controllers.Order", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */

			onInit: function() {				
				this.getRouter().getRoute("orderRoute").attachPatternMatched(this.onOrderRouteMatched, this);					
			},

			onOrderRouteMatched: function(oEvent) {	
				
				this._wizard = this.getView().byId("ShoppingCartWizard");
				
				this.getView().setBindingContext(new ContextBinding(this.getModel(),"/BasketHeaderSet('')"));
				
			    var oOrderModel = new sap.ui.model.json.JSONModel();	
			    oOrderModel.setProperty("/selectedPayment", "Credit Card");
			    oOrderModel.setProperty("/selectedDeliveryMethod", "Standard Delivery");
			    oOrderModel.setProperty("/differentDeliveryAddress", false);
			    oOrderModel.setProperty("/CashOnDelivery", {});
			    oOrderModel.setProperty("/BillingAddress", {});
			    oOrderModel.setProperty("/DeliveryAddress", {});
			    oOrderModel.setProperty("/CreditCard", {});
				
				this.getView().setModel(oOrderModel,'Order');
				
				this.byId("wizardNavContainer").to(this.byId("wizardContentPage"));
			},
				
			

			goToPaymentStep: function () {
				var selectedKey = this.getModel('Order').getProperty("/selectedPayment");

				switch (selectedKey) {
					case "Credit Card" :
						this.getView().byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));
						break;
					case "Bank Transfer" :
						this.getView().byId("PaymentTypeStep").setNextStep(this.getView().byId("BankAccountStep"));
						break;
					case "Cash on Delivery" :
						default:
						this.getView().byId("PaymentTypeStep").setNextStep(this.getView().byId("CashOnDeliveryStep"));
						break;
				}
			},
			
			setPaymentMethod: function () {
				this.setDiscardableProperty({
					message: "Are you sure you want to change the payment type ? This will discard your progress.",
					discardStep:this.getView().byId("PaymentTypeStep"),
					modelPath: "/selectedPayment",
					historyPath: "prevPaymentSelect"
				});
			},
			
			checkCreditCardStep: function(value){				
				var sCardName = this.getModel('Order').getProperty("/CreditCard/Name") || "";
				var oElement = this.byId("CreditCardStep");				
				if (sCardName.length < 2) {
					this._wizard.invalidateStep(oElement);
				} else {
					this._wizard.validateStep(oElement);
				}
			},
			
			checkCashOnDeliveryStep: function () {
				var sFirstName = this.getModel('Order').getProperty("/CashOnDelivery/FirstName") || "";
				var oElement = this.byId("CashOnDeliveryStep");
				if (sFirstName.length < 2) {
					this._wizard.invalidateStep(oElement);
				} else {
					this._wizard.validateStep(oElement);
				}
			},
			
			checkBillingStep: function () {
				
				var orderModel = this.getModel('Order');
				
				var sAddress = orderModel.getProperty("/BillingAddress/Address") || "";
				var sCity = orderModel.getProperty("/BillingAddress/City") || "";
				var sZipCode = orderModel.getProperty("/BillingAddress/ZipCode") || "";
				var sCountry = orderModel.getProperty("/BillingAddress/Country") || "";
				
				var oElement = this.byId("BillingStep");	

				if (sAddress.length < 2 || sCity.length < 2 || sZipCode.length < 2 || sCountry.length < 2) {
					this._wizard.invalidateStep(oElement);
				} else {
					this._wizard.validateStep(oElement);
				}
			},
			
			checkDeliveryStep: function () {
				
				var orderModel = this.getModel('Order');
				
				var sAddress = orderModel.getProperty("/DeliveryAddress/Address") || "";
				var sCity = orderModel.getProperty("/DeliveryAddress/City") || "";
				var sZipCode = orderModel.getProperty("/DeliveryAddress/ZipCode") || "";
				var sCountry = orderModel.getProperty("/DeliveryAddress/Country") || "";
				
				var oElement = this.byId("DeliveryAddressStep");
				

				if (sAddress.length < 2 || sCity.length < 2 || sZipCode.length < 2 || sCountry.length < 2) {
					this._wizard.invalidateStep(oElement);
				} else {
					this._wizard.validateStep(oElement);
				}
			},
			
			billingAddressComplete: function () {
				var sNextStepId = (this.getModel('Order').getProperty("/differentDeliveryAddress"))
					? "DeliveryAddressStep"
					: "DeliveryTypeStep";
				this.byId("BillingStep").setNextStep(this.byId(sNextStepId));

			},
			
			completedHandler: function () {
				this.byId("wizardNavContainer").to(this.byId("summaryPage"));
			},
			
			onReturnToShopButtonPress: function () {
				this.getRouter().navTo("basketRoute");
			},
			
			setDiscardableProperty : function (params) {
				if (this._wizard.getProgressStep() !== params.discardStep) {
					MessageBox.warning(params.message, {
						actions:[MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === MessageBox.Action.YES) {
								this._wizard.discardProgress(params.discardStep);
								history[params.historyPath] = this.getModel('Order').getProperty(params.modelPath);
							} else {
								this.getModel('Order').setProperty(params.modelPath, history[params.historyPath]);
							}
						}.bind(this)
					});
				} else {
					history[params.historyPath] = this.getModel('Order').getProperty(params.modelPath);
				}
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
			
			_navBackToStep: function (oEvent) {
				var sStep = oEvent.getSource().data("navBackTo");
				var oStep = this.byId(sStep);
				this._navToWizardStep(oStep);
			},

			/**
			 * navigates to WizardStep
			 * @private
			 * @param {Object} oStep WizardStep DOM element
			 */
			_navToWizardStep: function (oStep) {
				var oNavContainer = this.byId("wizardNavContainer");
				var _fnAfterNavigate = function () {
					this.byId("ShoppingCartWizard").goToStep(oStep);
					// detaches itself after navigaton
					oNavContainer.detachAfterNavigate(_fnAfterNavigate);
				}.bind(this);

				oNavContainer.attachAfterNavigate(_fnAfterNavigate);
				oNavContainer.to(this.byId("wizardContentPage"));
			},
			
			handleWizardCancel: function () {	
				MessageBox.warning(this.getText("checkoutControllerAreyousurecancel"), {
					actions: [MessageBox.Action.YES,
							  MessageBox.Action.NO],
					onClose: function (oAction) {						
						if (oAction === MessageBox.Action.YES) {		
													this._resetOrderProcess();
									                this._onGoHome();	
						}
					}.bind(this)
				});
			},

			/**
			 * Called from <code>ordersummary</code>
			 * shows warning message and submits order if affirmed
			 */
			handleWizardSubmit: function () {
			
				MessageBox.confirm(this.getText("checkoutControllerAreyousuresubmit"), {
					actions: [MessageBox.Action.YES,
							  MessageBox.Action.NO],
					onClose: function (oAction) {
						
						if (oAction === MessageBox.Action.YES) {

							var oDataModel = this.getModel();
							/// get path of the selected line to remove				
											
											var sPath = this.getView().getBindingContext().getPath();
											this.setBusy(true);
							/// send a remove request				
											oDataModel.remove(sPath, {
												success: function() {
													this.setBusy(false);
													oDataModel.refresh(true);
													this._resetOrderProcess();
													this.byId("wizardNavContainer").to(this.byId("orderCompletedPage"));												
												}.bind(this),
												error: function(oError) {
													this.setBusy(false);						
													var errorTxt = JSON.parse(oError.responseText).error.message.value;
													MessageToast.show(errorTxt, {
														closeOnBrowserNavigation: false
													});
												}.bind(this)
											});														
						}
					}.bind(this)
				});
				
			},
			
			_resetOrderProcess: function () {
							// resets Wizard
							var oWizard = this.byId("ShoppingCartWizard");
						    this._navToWizardStep(this.byId("ContentsStep"));
							oWizard.discardProgress(oWizard.getSteps()[0]);
							//reset order data
							var oOrderModel = this.getModel('Order')
						    oOrderModel.setProperty("/selectedPayment", "Credit Card");
						    oOrderModel.setProperty("/selectedDeliveryMethod", "Standard Delivery");
						    oOrderModel.setProperty("/differentDeliveryAddress", false);
						    oOrderModel.setProperty("/CashOnDelivery", {});
						    oOrderModel.setProperty("/BillingAddress", {});
						    oOrderModel.setProperty("/DeliveryAddress", {});
						    oOrderModel.setProperty("/CreditCard", {});	
			},
			
			_onCancel:function(){
				
				MessageBox.warning(this.getText('orderCancel'), {
					actions:[MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							this.onNavButton();
						} 
					}.bind(this)
				});								
				
			},
			
			_onGoHome: function(){
				this.getRouter().navTo("initialRoute");
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