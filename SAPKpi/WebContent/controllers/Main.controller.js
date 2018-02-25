/**
 * Main controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPKpi.Application
 */


sap.ui.define(
    [   "SAPKpi/Application/controllers/BaseController",
        "sap/ui/model/json/JSONModel"  
    ],
    function (BaseController, JSONModel) {
        "use strict";

        return BaseController.extend("SAPKpi.Application.controllers.Main", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            onInit: function () {
            	
            	var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "appView");
	
				fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				};
	
				this.getOwnerComponent().getModel().metadataLoaded().
					then(fnSetAppNotBusy);
	
				// apply content density mode to root view
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		  },

            /**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
             * 
			 */
            onBeforeRendering: function () { },

            /**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
             * 
			 */
            onAfterRendering: function () { },

            /**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * 
			 */
            onExit: function () { }
        });
    }
);
