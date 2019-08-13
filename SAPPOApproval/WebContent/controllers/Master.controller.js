/**
 * Master controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPPOApproval.Application
 */
  
  
sap.ui.define(
    [   "SAPPOApproval/Application/controllers/BaseController",
        "sap/ui/model/json/JSONModel",
        'sap/ui/model/Filter',
		"sap/ui/Device",
		"sap/m/MessageToast",
    ],
    function (BaseController,SAPJsonModel, Filter,Device,MessageToast) {
        "use strict";
       
        return BaseController.extend("SAPPOApproval.Application.controllers.Master", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */       	
        	
            onInit: function () {  
              	this.getRouter().getRoute("initialRoute").attachPatternMatched(this.onInitialRouteMatched, this);	 
                this.getRouter().getRoute("successRoute").attachPatternMatched(this.onSuccessRouteMatched, this);
                
        		if (Device.support.touch) {
    				var bar = this.getView().byId("searchBar");
    				var page = this.getView().byId("page");
    				page.insertAggregation("content", bar, 1);
    			}
			},
			
			
			onSave: function () {
				this.setBusy(true);
				this.getModel("main").submitChanges({
					success: function (oData) {
						MessageToast.show("Saved...");
						this.setBusy(false);
						this.setInfo("toSave", false);
					}.bind(this),
					error: function (oError) {
						this.setBusy(false);
					}.bind(this)
				});
			},

			onCreate: function () {
				
				var oContext = this.getModel("main").createEntry("/HeaderSet");
				this.setInfo("toSave",true);	
				this.getRouter().navTo(
					"createRoute", {
						path:encodeURI(oContext.getPath().slice(1))
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
            
            onPoNumberSearch : function (oEvt) {       
    			// add filter for search
    			var aFilters = [];
    			var sQuery = oEvt.getSource().getValue();
    			if (sQuery && sQuery.length > 0) {
    				var filter = new Filter("Ebeln", sap.ui.model.FilterOperator.Contains, sQuery);
    				aFilters.push(filter);
    			};
    			// update list binding
    			var list = this.getView().byId("lstPO");
    			var binding = list.getBinding("items");
    			binding.filter(aFilters, "Application");    
    		},
    		
            _onListUpdateFinished: function(oEvent){
            	this.setInfo("actualCount", oEvent.getParameter("actual"));
            	this.setInfo("totalCount", oEvent.getParameter("total"));
            },
            
            onInitialRouteMatched:function(oEvent) {            	
        
            },                    
                        
            onSuccessRouteMatched:function(oEvent){              	
                if (this.getOwnerComponent().InitialLoaded != true ){
               	 this.getRouter().navTo("initialRoute");
               	 return;
               	}	            
            },
           	            				  
            _onItemPress : function(oEvent){  
            	var sPath = oEvent.getParameter("listItem").getBindingContext("main").getPath().slice(1);  
	            this.getRouter().navTo(
	            		"detailRoute", {
	            			path:encodeURI(sPath)
	            		}
	            ) 
            },
            
            handleRefresh:function(){
            	this.getModel("main").refresh();
            }
        });
    }
);


