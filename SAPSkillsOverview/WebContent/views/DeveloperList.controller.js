/**
 * DeveloperList controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPSkillsOverview.Application
 */

sap.ui.define(
    [   "SAPSkillsOverview/Application/views/BaseController",
        "sap/ui/core/routing/History",
        "sap/ui/model/json/JSONModel"
    ],
    function (BaseController,History, SAPJsonModel) {
        "use strict";

        return BaseController.extend("SAPSkillsOverview.Application.views.DeveloperList", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            onInit: function () {
            	this.getRouter().getRoute("developersRoute").attachPatternMatched(this.onDevelopersRoute, this);
             	this.setModel(new SAPJsonModel([]), "Skills");	
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
            
            onDevelopersRoute: function(oEvent){            
	              var oModel = this.getModel();            	
	              var sSkill = decodeURIComponent(oEvent.getParameter("arguments").Skill);	              
	              var oFilters = new Array(); 		            		
		          var oFilter = new sap.ui.model.Filter("Sname", sap.ui.model.FilterOperator.EQ, sSkill);		              			              		
		          oFilters.push(oFilter); 	 		          
		          var _this = this;      
		          _this.setBusy(true); 
	            	oModel.read("/DevelopersBySkillSet",{ 
	            		filters: oFilters,
	            		async: true,
	            		success: function(oData, oResponse){ 
	            			_this.setBusy(false); 
	            			var counter=0;	            			
	            			$.each(oData.results, function(iIndex, oEntry){ 
	            				counter++; 
	            				}
	                    	);	            			
	            			_this.getModel("Skills").setData(oData.results); 	     	
	            			_this.getModel("Skills").setProperty("/DevCount", counter); 
	            			_this.getModel("Skills").setProperty("/Description", oData.results[0].Sdesc); 	
	            		},
	            		error: function(oError){
	            			_this.setBusy(false); 
	            		}
	            	});            		                 	
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
