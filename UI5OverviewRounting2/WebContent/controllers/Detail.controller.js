/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.routing
 */
  
  
sap.ui.define(
    [ "ui5/overview/routing2/controllers/BaseController",      
      "sap/ui/model/Context"  
  ],
  function (BaseController, ContextBinding) {
        "use strict";
       
        return BaseController.extend("ui5.overview.routing2.controllers.Detail", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	        	
            onInit: function () {              	
            	this.getRouter().getRoute("detailRoute").attachPatternMatched(this.onDetailRouteMatched, this);
            	this.getRouter().getRoute("fullScreenRoute").attachPatternMatched(this.onDetailRouteMatched, this);
	        },  
	        
	        _goToFullScreen: function(){
	        	
              	var oBindingContext = this.getView().getBindingContext(); 
              	
            	var path = encodeURIComponent(oBindingContext.sPath);   	            	
                
            	this.setInfo('fullScreen',true);
            	
                this.getRouter().navTo(
               				"fullScreenRoute",
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
            onAfterRendering: function () { },

            /**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */		
            onExit: function () { },           

            
            onDetailRouteMatched: function(oEvent){    
            	
                	var oModel = this.getModel();
                	
                	var sParameter = oEvent.getParameter("arguments").path;     
                	var path = decodeURIComponent(sParameter);   
                    var oDetailBindingCtx = new ContextBinding(oModel, path);
                	this.getView().setBindingContext(oDetailBindingCtx);          
                	   	
                	
//                	this.getView().bindElement({
//    					path : sObjectPath,
//    					events: {
//    						change : this._onBindingChange.bind(this),
//    						dataRequested : function () {
//    							oViewModel.setProperty("/busy", true);
//    						},
//    						dataReceived: function () {
//    							oViewModel.setProperty("/busy", false);
//    						}
//    					}
//    				});
             },
             
             onNavButton: function(){  ///redefined function from basecontroller
            	 
            	 this.setInfo('fullScreen',false);
/// call the parent function            	 
            	 BaseController.prototype.onNavButton.apply();	
          
             }
        });
    }
);


