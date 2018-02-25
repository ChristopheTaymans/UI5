/**
 * DomainStatus controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPSkills.Application
 */
  
  
sap.ui.define(
    [
      "SAPSkillsOverview/Application/views/BaseController",
      "sap/ui/model/odata/v2/ODataContextBinding",
      "sap/ui/model/json/JSONModel",
      'sap/ui/model/Filter',
      'sap/m/MessageToast'
  ],
  function (BaseController, SAPODataContextBinding, SAPJsonModel, Filter, MessageToast) {
        "use strict";
       
        return BaseController.extend("SAPSkillsOverview.Application.views.DomainStatus", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	
        	
            onInit: function () {              	
            	this.getRouter().getRoute("domainRoute").attachPatternMatched(this.onDomainRouteMatched, this);	   
				this.oTileFragment = sap.ui.xmlfragment("SAPSkillsOverview.Application.views.DomainStatusTile", this);
				this.oListFragment = sap.ui.xmlfragment("SAPSkillsOverview.Application.views.DomainStatusList", this);				
				var oPage = this.getView().byId("page");				 
					oPage.addContent(this.oTileFragment);			
		         if (!jQuery.support.touch) {     		
		           this.getView().addStyleClass("sapUiSizeCompact");
		         }					
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
            onExit: function () { 
				this.oTileFragment.destroy();
				this.oListFragment.destroy();            	
            },
                        
            onDomainRouteMatched: function(oEvent){               	          
	          	var Filters = [];
            	var sTeam= oEvent.getParameter("arguments").Team;
            	var oDataModel = this.getModel();            	
            	var oViewModel = new SAPJsonModel();     
                var _this = this; 
                _this.setBusy(true); 
            	if (sTeam != 'ALL'){
	    		   	var oFilter = new Filter('TeamId', sap.ui.model.FilterOperator.EQ, sTeam, '');
	    		   	Filters.push(oFilter); 	  
            	};
               	oDataModel.read("/DomainSet" ,{                		
            		async: true,
            		filters: Filters,            		
            		success: function(oData, oResponse){    
            			_this.setBusy(false); 
            			oViewModel.setData(oData.results);             			
            			_this.setInfo("Count",oData.results.length);   
                 	},                 	
            		error: function(oError){        
            			_this.setBusy(false); 
            		}
            	 });
                this.setModel(oViewModel, "Domains");  
            }, 
            
            _goToSkillList: function(oBindingContext){    
               	if ( oBindingContext ){                	
	            	var sDomain = encodeURIComponent(this.getModel("Domains").getProperty(oBindingContext.sPath).Dname);   	            	
	             	if ((this.getModel("Domains").getProperty(oBindingContext.sPath).Devnbr) == 0){
	             		MessageToast.show(this.getResourceBundle().getText("NO_DEVELOPER"));
	               	} 
	               	else
	                {
		            	this.getRouter().navTo(
		            			"statusRoute",
		            			{
		            				Domain : sDomain
		            			}
		            	)
	                }
            	}
                else
                {
                	MessageToast.show(this.getResourceBundle().getText("ERROR"));
                };
            },
            
            _onPressTile: function(oEvent){  
            	var oBindingContext = oEvent.getSource().getBindingContext("Domains");            	
            	this._goToSkillList(oBindingContext);
            },
                        
            _onItemPress: function(oEvent){ 
            	var oBindingContext = oEvent.getParameter("listItem").getBindingContext("Domains");         
            	this._goToSkillList(oBindingContext);            	
            },         
            
            onSwitch: function(oEvent){          
            	var oPage = this.getView().byId("page");	            	
            	if (oEvent.getParameter('state')){            		
            		oPage.removeContent("DomainsList");
            		oPage.addContent(this.oTileFragment);
            	}
            	else
            	{            	
            		oPage.removeContent("DomainTileContainer");
            		oPage.addContent(this.oListFragment);
            	};		
            },		
        });
    }
);


