/**
 * Create controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPDomainManage.Application
 */

sap.ui.define(
    [
        "SAPDomainManage/Application/views/BaseController",
        "sap/ui/core/routing/History",
        "sap/ui/model/json/JSONModel",
        'sap/m/MessageToast',
    ],
    function (BaseController,History,SAPJsonModel,MessageToast) {
        "use strict";

        return BaseController.extend("SAPDomainManage.Application.views.Create", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            onInit: function () {            	
            	this.getRouter().getRoute("createRoute").attachPatternMatched(this._onCreateRoute, this);            	
           	    if (!jQuery.support.touch) {     		
         	    	this.getView() .addStyleClass("sapUiSizeCompact");
           		}           	    
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
                        
            _onCreateRoute: function(oEvent){                    
                this.setModel(new SAPJsonModel(),"NewDomain");
                this.getModel("Saved").getData().Save=false;
            },
            
            handleSavePress: function(oEvent){               	
            	var oDataModel = this.getModel();  
            	var oNewEntry = this.getModel("NewDomain").oData;  
                if (oNewEntry.Dname == null|| oNewEntry.ShortDesc == null)
                	{
                	MessageToast.show(this.getText("REQUIRED_VALUE"));
                	return;
                	}
                if ( oNewEntry.Dname.trim() == ""|| oNewEntry.ShortDesc.trim() == "")
            	{
            	MessageToast.show(this.getText("REQUIRED_VALUE"));
            	return;
            	};                   
            	var _this = this;      
            	_this.setBusy(true);
            	oDataModel.create('/DomainSet',oNewEntry, {                		
            		success: function(oData,response){ 
            			_this.setBusy(false);
            			MessageToast.show(_this.getText("SAVED"),{closeOnBrowserNavigation:false });
            		   _this._goToDetail(oData.Dname);
                 	},                 	
            		error: function(oError){     
            			_this.setBusy(false);
            			var errorTxt = JSON.parse(oError.responseText).error.message.value;  
            			MessageToast.show(errorTxt,{closeOnBrowserNavigation:false });              			
            		}
            	 });          	
            },
            
          _goToDetail:function(domain){   	
        	    this.getModel("Saved").getData().Save=true;
   				this.getRouter().navTo(
            			"domainRoute", {
            				Domain:"DomainSet('"+ encodeURIComponent(domain) +"')"
            			}
            		)  
          },
            
          handleCancelPress: function(){         
        	    this.getModel("Saved").getData().Save=true;
 				this.getRouter().navTo("initialRoute");   
          }
        });
    }
);
