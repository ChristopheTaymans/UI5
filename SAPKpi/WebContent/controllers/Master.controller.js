/**
 * Master controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPKpi.Application
 */
  
  
sap.ui.define(
    [   "SAPKpi/Application/controllers/BaseController",
        "sap/ui/Device",
        "sap/ui/model/json/JSONModel",
        'sap/ui/model/Filter'
    ],
    function (BaseController,Device, SAPJsonModel,Filter) {
        "use strict";
       
        return BaseController.extend("SAPKpi.Application.controllers.Master", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */       	
        	
            onInit: function () {  
            	
            	this.getRouter().getRoute("initialRoute").attachPatternMatched(this.onInitialRouteMatched, this); 
                            	
        		if (Device.support.touch) {
    				var bar = this.getView().byId("searchBar");
    				var page = this.getView().byId("page");
    				page.insertAggregation("content", bar, 1);
    			}
            },
            
            onKpiSearch : function (oEvt) {       
    			// add filter for search
    			var aFilters = [];
    			var sQuery = oEvt.getSource().getValue();
    			if (sQuery && sQuery.length > 0) {
    				var filter = new Filter("DescText", sap.ui.model.FilterOperator.Contains, sQuery);
    				aFilters.push(filter);
    			};
    			// update list binding
    			var list = this.getView().byId("lst");
    			var binding = list.getBinding("items");
    			binding.filter(aFilters, "Application");    
    		},
    		
            _onListUpdateFinished: function(oEvent){
            	this.setInfo("loaded", true);   
            	this.setInfo("actualCount", oEvent.getParameter("actual"));
            	this.setInfo("totalCount", oEvent.getParameter("total"));
            },
            
            onInitialRouteMatched:function(oEvent) {            	
            
            },
            
                                   	            				  
            _onItemPress : function(oEvent){  
            	var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();  
    	            this.getRouter().navTo(
	            		"chartRoute", {
	            			path:sPath.substr(1)
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
            onExit: function () { }  
        });
    }
);


