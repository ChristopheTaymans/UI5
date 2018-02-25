/**
 * Master controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.oData
 */
  
  
sap.ui.define(
    [   "ui5/overview/oData/controllers/BaseController",        
        "sap/ui/model/json/JSONModel"     
    ],
    function (BaseController, SAPJsonModel) {
        "use strict";
       
        return BaseController.extend("ui5.overview.oData.controllers.CategoriesList", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */       	
        	
            onInit: function () {   				
            	this.getRouter().getRoute("initialRoute").attachPatternMatched(this.onInitialRouteMatched, this); 
/// read for the first time, the basket header set...and bind it to the view...bindElement triggers a read in the data model...
            	this.getView().bindElement("/BasketHeaderSet(' ')");
/// There is a way to capture the oData request and reply in function..look the commented code                	
//            	oView.bindElement({
//    				path: "/BasketHeaderSet(' ')",
//    				events: {
//    					dataRequested: function () {
//    						oView.setBusy(true);
//    					},
//    					dataReceived: function () {
//    						oView.setBusy(false);
//    					}
//    				}
//    			});
            },
               		            
            onInitialRouteMatched:function(oEvent) {            	
            	this.getView().byId('categoryList').removeSelections();         
            },        
            
            _onListUpdateFinished: function(oEvent){            				
				
            },
                        
            _onItemPress: function(oEvent){             	
              	var oBindingContext = oEvent.getParameter("listItem").getBindingContext();               	
            	var path = encodeURIComponent(oBindingContext.sPath);   	     
                this.getRouter().navTo(
               				"productRoute",
               				{
               					path : path
               				}
            		)                       	
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
            onAfterRendering: function () { 
            	
            },

            /**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */		
            onExit: function () { }  
        });
    }
);


