/**
 * SkillStatus controler component
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
      "sap/ui/core/routing/History",
      'sap/m/MessageToast'
  ],
  function (BaseController, SAPODataContextBinding, SAPJsonModel, History, MessageToast) {
        "use strict";
       
        return BaseController.extend("SAPSkillsOverview.Application.views.SkillStatus", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	
        	
            onInit: function () {              	
            	this.getRouter().getRoute("statusRoute").attachPatternMatched(this.onStatusRouteMatched, this);	   
				this.oTileFragment = sap.ui.xmlfragment("SAPSkillsOverview.Application.views.SkillStatusTile", this);
				this.oListFragment = sap.ui.xmlfragment("SAPSkillsOverview.Application.views.SkillStatusList", this);				
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
            
            _oninitialRouteMatched: function(oEvent){
            	this.getRouter().navTo(
            			"statusRoute",
            			{
            				Domain: 'All'
            			}
            		)
            },
            
            onStatusRouteMatched: function(oEvent){ 
            	var oModel = this.getModel();  
                if (oModel){
	            	var domain = oEvent.getParameter("arguments").Domain;            	
	                if (domain != 'All' ){     	              
	            	 var sBindingPath = "/DomainSet('" + oEvent.getParameter("arguments").Domain+ "')";
	            	 var oUrlParameter = {"$expand": "DomainSkillStatusSet"};         	
	            	 var oDetailBindingCtx = new SAPODataContextBinding(oModel, sBindingPath);
	            	 this.getView().setBindingContext(oDetailBindingCtx);            	 
	                }
	                else
	                {
	                    sBindingPath = "/DomainSkillStatusSet";
	                };  
	                
	            	var oExtraModel = new SAPJsonModel();      
	            	var _this = this;
	            	_this.setBusy(true); 
	            	oModel.read(sBindingPath,{ 
	            		urlParameters: oUrlParameter,
	            		async: true,
	            		success: function(oData, oResponse){    
	            			_this.setBusy(false); 
	            		 	if ( oData.results ){
	            		 		_this.setInfo("Domain", ""); 
	            		 		oExtraModel.setProperty("/Status", oData.results);              		 	
	            		 	}
	            		 	else
	            		 	{
	            		 		_this.setInfo("Domain", oData.ShortDesc);  
	            		 		oExtraModel.setProperty("/Status", oData.DomainSkillStatusSet.results);       
	            			};            			
	            		},
	            		error : function(oError){
	            			_this.setBusy(false); 
	            		}
	            	});
	            	this.setModel(oExtraModel, "SKILL");   
                }
            }, 
            
            _goToDeveloperList: function(oBindingContext){            	
            	if ( oBindingContext ){                	
	            	var sSkill = encodeURIComponent(this.getModel("SKILL").getProperty(oBindingContext.sPath).Sname);   	            	
	             	if ((this.getModel("SKILL").getProperty(oBindingContext.sPath).Devnbr) == 0){
	             		MessageToast.show(this.getResourceBundle().getText("NO_DEVELOPER"));
	               	} 
	               	else
	                {
	               		this.getRouter().navTo(
	               				"developersRoute",
	               				{
	               					Skill : sSkill
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
            	var oBindingContext = oEvent.getSource().getBindingContext("SKILL");            	
            	this._goToDeveloperList(oBindingContext);
            },
                        
            _onItemPress: function(oEvent){ 
            	var oBindingContext = oEvent.getParameter("listItem").getBindingContext("SKILL");         
            	this._goToDeveloperList(oBindingContext);            	
            },         
            
            onSwitch: function(oEvent){          
            	var oPage = this.getView().byId("page");	            	
            	if (oEvent.getParameter('state')){            		
            		oPage.removeContent("SkillsList");
            		oPage.addContent(this.oTileFragment);
            	}
            	else
            	{            	
            		oPage.removeContent("TileContainer");
            		oPage.addContent(this.oListFragment);
            	};		
            },
            
            onNavButton: function(){         
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


