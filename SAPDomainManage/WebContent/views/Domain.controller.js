/**
 * Doamin controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPDomain.manage.Application
 */
  
  
sap.ui.define(
    [
      'SAPDomainManage/Application/views/BaseController',
      "sap/ui/model/odata/v2/ODataContextBinding",
      "sap/ui/model/json/JSONModel",
      'sap/m/MessageToast',
      'sap/m/MessageBox'
  ],
  function (BaseController, SAPODataContextBinding, SAPJsonModel, MessageToast,MessageBox) {
        "use strict";
       
        return BaseController.extend("SAPDomainManage.Application.views.Domain", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	
        	
            onInit: function () {
            	this.getRouter().getRoute("domainRoute").attachPatternMatched(this.onDomainRouteMatched, this);	   
                this.oDisplayFragment = sap.ui.xmlfragment("SAPDomainManage.Application.views.DomainDisplay", this);	
				this.oEditFragment = sap.ui.xmlfragment("SAPDomainManage.Application.views.DomainEdit", this);				
		         if (!jQuery.support.touch) {     		
		           this.getView() .addStyleClass("sapUiSizeCompact");
		         }					
	            },      
	                      

            /**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			  */
            onBeforeRendering: function () {},

            /**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
             * 
			 */
            onAfterRendering: function () {},

            /**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */		
            onExit: function () {				
				this.oDisplayFragment.destroy();
				this.oEditFragment.destroy();
            },          

            
            onDomainRouteMatched: function(oEvent){             	
            	this.sPath = '/' + oEvent.getParameter("arguments").Domain; 
            	this._dataRefresh(this.sPath);                
            	var oPage = this.getView().byId("page");
            	oPage.removeContent("dEditBox");
            	oPage.addContent(this.oDisplayFragment);  
           	
            }, 
            
            _dataRefresh:function(sPath){            	            	       	            	
                var oDataModel = this.getModel();            	
            	var oViewModel = new SAPJsonModel();                 		 
               	var _this = this;               	
               	_this.setBusy(true);       		
               	oDataModel.read(sPath ,{                		
            		async: true,
            		success: function(oData, oResponse){    
            			_this.setBusy(false);
	            	    oViewModel.setData(oData); 
	                	var oDeleteButton = _this.getView().byId("delete");
	        			if( oData.Sknbr != 0){
	        				oDeleteButton.setVisible(false); 
	        			}
	        			else
	        		    {
	        				oDeleteButton.setVisible(true);  
	        			}; 
        			
                 	},                 	
            		error: function(oError){  
            			_this.setBusy(false);
            		}
            	 });               	
                this.setModel(oViewModel, "DomainSet");    
                this.getModel("Saved").getData().Save=true;            	
            },
            
            _update: function(){                	
                var oDataModel = this.getModel();            	
            	var oData =  this.getModel("DomainSet").getData(); 
               	var _this = this;   
               	_this.setBusy(true);
               	oDataModel.update(this.sPath ,oData, {                		
            		async: true,
            		success: function(){  
            			_this.setBusy(false);
            			MessageToast.show(_this.getText("SAVED"),{closeOnBrowserNavigation:false });
            		   _this._toggleButtonsAndView(false,false);
                 	},                 	
            		error: function(oError){  
            			_this.setBusy(false);
            			 var errorTxt = JSON.parse(oError.responseText).error.message.value;  
            			 MessageToast.show(errorTxt,{closeOnBrowserNavigation:false });            			
            		}
            	 });
            	
            },
    		_toggleButtonsAndView : function (bEdit) {
    			var oView = this.getView();
    			var oPage = this.getView().byId("page");     			
    			// Show the appropriate action buttons    			
    			oView.byId("edit").setVisible(!bEdit);
    			if( this.getModel("DomainSet").getData().Sknbr != 0){
    				oView.byId("delete").setVisible(false); 
    			}
    			else
    		    {
    				oView.byId("delete").setVisible(!bEdit);  
    			};
    			oView.byId("save").setVisible(bEdit);
    			oView.byId("cancel").setVisible(bEdit);  
    			// Set the right form type
    			if (bEdit){
    				oPage.removeContent("DisplayBox");    			
    				oPage.addContent(this.oEditFragment);   
                	this.getModel("Saved").getData().Save=false;
                }
    			else
    			{
    				oPage.removeContent("dEditBox");   
    				oPage.addContent(this.oDisplayFragment);    				
    			   this._dataRefresh(this.sPath)
    			};    		 
    		},
    		
            handleEditPress: function(oEvent){   
            	this._toggleButtonsAndView(true)
            }, 
            
            handleSavePress: function(oEvent){ 
            	this._update();   
            },   
            
            handleDeletePress: function(oEvent){ 
            	var _this = this;   
    			MessageBox.confirm(
    					this.getText("CONFIRMATION"),{    						
    						onClose: function(oAction){
    							if (oAction=='OK'){
    								_this._deleteDomain();
    							}    						
    						}
    					}
    				);    
            },
            
            _deleteDomain:function(){
            	var oDataModel = this.getModel();            	
              	var oData =  this.getModel("DomainSet").getData(); 
                var _this = this;    
                _this.setBusy(true);
                 oDataModel.remove(this.sPath, {                		
              		async: true,
              		success: function(){  
              			_this.setBusy(false);
              			MessageToast.show(_this.getText("DELETED"),{closeOnBrowserNavigation:false });
              		   _this._toggleButtonsAndView(false,false);
              		 _this.getRouter().navTo(
 	            			"initialRoute"		)  
                   	},                 	
              		error: function(oError){ 
              			_this.setBusy(false);    
              			var errorTxt = JSON.parse(oError.responseText).error.message.value;   
              			MessageToast.show(errorTxt,{closeOnBrowserNavigation:false }); 
              		}
              	 });
            	            
            }, 
            handleCancelPress: function(oEvent){            	
            	this._toggleButtonsAndView(false);            	
            },             
        });
    }
);


