/**
 * Main controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPPOApproval.Application
 */


sap.ui.define(
    [   "SAPPOApproval/Application/controllers/BaseController"        
    ],
    function (BaseController) {
        "use strict";
        var oController =  BaseController.extend("SAPPOApproval.Application.controllers.Main");
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            oController.prototype.onInit= function () {  
				this.getOwnerComponent().getModel("main").metadataLoaded().then(function(){						
					this.getModel("main").attachPropertyChange(function(oEvent){
						this.setInfo("toSave",this.getModel("main").hasPendingChanges());					
					}.bind(this))
				}.bind(this));		
	
				// apply content density mode to root view
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		  };

   return oController;
    }
);
