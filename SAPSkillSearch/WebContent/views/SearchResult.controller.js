/**
 * SearchResult controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPSkillsSearch.Application
 */


sap.ui.define(
    [
        "SAPSkillsSearch/Application/views/BaseController",
        'sap/ui/model/Filter',
        "sap/ui/model/json/JSONModel",
        ],
        function (BaseController, Filter, SAPJsonModel) {
        "use strict";

        return BaseController.extend("SAPSkillsSearch.Application.views.SearchResult", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
                   	
            	
                onInit: function () { 
                 	this.getRouter().getRoute("resultRoute").attachPatternMatched(this._onResultRouteMatched, this);
            },
                      
            _onResultRouteMatched: function(oEvent){   
            
            	var oFilters = this.getModel("SkillSearchFilters").getData();     
                var oDataModel = this.getModel();            	
            	var oViewModel = new SAPJsonModel();                 		 
               	var _this = this;
                this.getView().byId("SearchResult").setBusy(true);           		
               	oDataModel.read("/SkillSearchResultSet" ,{                		
            		async: true,
            		filters: oFilters,            		
            		success: function(oData, oResponse){            		
            			oViewModel.setData(oData.results); 
            			_this.getView().byId("SearchResult").setBusy(false);   
                 	},                 	
            		error: function(oError){    
            			 _this.getView().byId("SearchResult").setBusy(false);   
            		}
            	 });
               	
                this.setModel(oViewModel, "SearchResult");      
            },
            

            _onItemPress:function(oEvent){
            	var sPath= oEvent.getParameter("listItem").getBindingContext("SearchResult").getPath();
            	var sDeveloper = oEvent.getParameter("listItem").getModel("SearchResult").getProperty(sPath+"/Bname");
             	this.getRouter().navTo(
            			"developerRoute", {
            				Developer:sDeveloper
            			}
            		)
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
            
            _onNavButton: function(){
             	this.getRouter().navTo(
            			"searchRoute"
            		)
            }
        });
    }
);
