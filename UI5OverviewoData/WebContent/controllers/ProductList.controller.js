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
		"sap/ui/model/odata/v2/ODataContextBinding",
		"sap/ui/model/Filter",
	],
	function(BaseController, SAPJsonModel, ContextBinding, Filter) {
		"use strict";

		return BaseController.extend("ui5.overview.oData.controllers.ProductList", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */

			onInit: function() {
				this.getRouter().getRoute("productRoute").attachPatternMatched(this.onProductRouteMatched, this);
			},

			onProductRouteMatched: function(oEvent) {

				var productList = this.getView().byId('productList').removeSelections();

				/// bind selected product categories to view through binding context    						
				var path = decodeURIComponent(oEvent.getParameter("arguments").path);
				
				var oModel = this.getModel();
				var oDetailBindingCtx = new ContextBinding(oModel, path);
				this.getView().setBindingContext(oDetailBindingCtx);
				
	  		 },

			_onItemPress: function(oEvent) {
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
				var path = encodeURIComponent(oBindingContext.sPath);
				this.getRouter().navTo(
					"detailRoute", {
						path: path
					}
				)
			},

			_onBackPress: function(oEvent) {
				this.getRouter().navTo(
					"initialRoute"
				)
			},

			_onProductSearch: function(oEvent) {
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);

				};
				// update list binding
				var list = this.getView().byId("productList");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
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