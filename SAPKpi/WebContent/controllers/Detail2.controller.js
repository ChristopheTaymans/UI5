/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPKpi.Application
 */
  
  
sap.ui.define(
    [ "SAPKpi/Application/controllers/DetailBaseController",      
      "sap/ui/model/odata/v2/ODataContextBinding",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
      "sap/ui/core/routing/History"
  ],
  function (DetailBaseController, SAPODataContextBinding, SAPJsonModel, MessageToast, MessageBox,History) {
        "use strict";
       
        return DetailBaseController.extend("SAPKpi.Application.controllers.Detail2", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	        	
            onInit: function () {              	
            	this.getRouter().getRoute("figureRoute").attachPatternMatched(this.onFigureRouteMatched, this);  
	        },  
	        

            /**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
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
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */		
            onExit: function () { },           
            
            
            onFigureRouteMatched: function(oEvent){  
            	
            	this.setInfo("FigureView",true);            	
            	this.onDetailRouteMatched(oEvent);  

            },     
            
            _onChart:function(oEvent){            
            	var sPath= this.getView().getBindingContext().getPath(); 
            	 this.getRouter().navTo(
 	            		"chartRoute", {
 	            			path:sPath.substr(1)
 	            		}
 	            ) 
            },

        });
    }
);


