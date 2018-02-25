/**
 * FullScreen controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	template01.Application
 */

sap.ui.define(
    [   "template01/Application/controllers/BaseController",          
        "sap/ui/core/routing/History",
    ],
    function (BaseController,History) {
        "use strict";

        return BaseController.extend("template01.Application.controllers.FullScreen", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            onInit: function () {
            	this.getRouter().getRoute("fullScreenRoute").attachPatternMatched(this._onFullScreenRoute, this);     
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
            onExit: function () { },
            
            _onFullScreenRoute: function(oEvent){            
	            	
	              var sParameter = oEvent.getParameter("arguments").parameter;	              
	              	                 	
            },
            
            _onNavButton: function(){         
            	var oHistory = History.getInstance();
    			var sPreviousHash = oHistory.getPreviousHash();
    			if (sPreviousHash !== undefined) {
    				window.history.go(-1);
    			} else {
    				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    				oRouter.navTo("initialRoute", true);
    			}
            }
        });
    }
);
