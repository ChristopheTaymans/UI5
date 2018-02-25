/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	template01.Application
 */
  
  
sap.ui.define(
    [ "template01/Application/controllers/BaseController",      
      "sap/ui/model/odata/v2/ODataContextBinding",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
      "sap/ui/core/routing/History"
  ],
  function (BaseController, SAPODataContextBinding, SAPJsonModel, MessageToast, MessageBox,History) {
        "use strict";
       
        return BaseController.extend("template01.Application.controllers.Detail", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	        	
            onInit: function () {              	
            	this.getRouter().getRoute("detailRoute").attachPatternMatched(this.onDetailRouteMatched, this);
            	this.getRouter().getRoute("fullScreenRoute").attachPatternMatched(this.onDetailRouteMatched, this);	 

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
            	
                if (this.getInfo("loaded") != true ){
                	 this.getRouter().navTo("initialRoute");
                	 return;
                	}
                	var oModel = this.getModel();
                	var sParameter = oEvent.getParameter("arguments").path;     
                	var sBindingPath = '/' + sParameter;
                	var oDetailBindingCtx = new SAPODataContextBinding(oModel, sBindingPath);
                	this.getView().setBindingContext(oDetailBindingCtx);   
                }, 
            
            _onSwitchScreen: function(oEvent){   
            	var sRoute;
            	if ( this.getInfo("fullScreen") ){
            		sRoute = "detailRoute";
            		this.setInfo("fullScreen",false)
            	}
            	else
            	{   sRoute = "fullScreenRoute";
            		this.setInfo("fullScreen", true);
            	}
            	var oBindingCtx = this.getView().getBindingContext();          
	            	this.getRouter().navTo(
	            			sRoute,
	            			{
	            				path : oBindingCtx.getPath().substr(1)
	            			}
	               )
            },
            
            onAccept:function(oEvent){     
    			MessageBox.confirm(
    					this.getText("CONFIRMATION_APPROVAL"),{    						
    						onClose: function(oAction){
    							if (oAction=='OK'){
    								this._sendTag('ExApproveTag'); 
    							}    						
    						}.bind(this)
    					}
    			);            	           	
            },                        
            
            onReject:function(oEvent){
    			MessageBox.confirm(
    					this.getText("CONFIRMATION_REJECT"),{    						
    						onClose: function(oAction){
    							if (oAction=='OK'){
    								this._sendTag('ExRejectTag');
    							}    						
    						}.bind(this)
    					}
    			);  
            },
            
            _sendTag:function(oTag){    
            	var oContext = this.getView().getBindingContext();
            	var aData= {
            			'Tag': this.getModel().getProperty(oTag, oContext ),
            	        'Comment' : this.getView().byId("textArea").getProperty("value")
            	};            	
            	var oModel = this.getModel();            
                var sPath = '/' + oModel.createKey("ProcessTagSet", aData);            	
            	oModel.update( sPath, aData,
            			{
            		   		success: function(){
            		   		MessageToast.show(this.getText("REQUESTSENT"),{closeOnBrowserNavigation:false });
            		   	       this.getRouter().navTo(
            		            		"successRoute", {
            		            			PoId:this.getModel().getProperty("Ebeln",oContext)
            		            		}
            		            ) 
            		   		}.bind(this)
            			}
                )
            },
            
            onNavButtonPress:function(oEvent){
            	var oHistory = History.getInstance();
    			var sPreviousHash = oHistory.getPreviousHash();
    			if (sPreviousHash !== undefined) {
    				window.history.go(-1);
    			} else {    			
    				this.getRouter().navTo("initialRoute", true);
    			}
            }

        });
    }
);


