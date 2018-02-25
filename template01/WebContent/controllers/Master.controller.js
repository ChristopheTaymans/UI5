/**
 * Master controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	template01.Application
 */
  
  
sap.ui.define(
    [   "template01/Application/controllers/BaseController",
        "sap/ui/Device",
        "sap/ui/model/json/JSONModel"
    ],
    function (BaseController,Device, SAPJsonModel) {
        "use strict";
       
        return BaseController.extend("template01.Application.controllers.Master", {
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
            
            onSupplierSearch : function (oEvt) {       
    			// add filter for search
    			var aFilters = [];
    			var sQuery = oEvt.getSource().getValue();
    			if (sQuery && sQuery.length > 0) {
    				var filter = new Filter("Name1", sap.ui.model.FilterOperator.Contains, sQuery);
    				aFilters.push(filter);
    			};
    			// update list binding
    			var list = this.getView().byId("lstPO");
    			var binding = list.getBinding("items");
    			binding.filter(aFilters, "Application");    
    		},
    		
            _onListUpdateFinished: function(oEvent){
            	this.setInfo("loaded", true);   
            	this.setInfo("actualCount", oEvent.getParameter("actual"));
            	this.setInfo("totalCount", oEvent.getParameter("total"));
            },
            
            onInitialRouteMatched:function(oEvent) {            	
            	this._loadData();  
            },
            
            _loadData:function(){
            	var oModel = this.getModel();
            	var oViewModel = new SAPJsonModel();  
            	this.setBusy(true);      
            	oModel.read( "/POInfoSet",{                		
            		async: true,
            		success: function(oData, oResponse){   
            			this.getView().byId("pullToRefresh").hide();
            			this.setBusy(false);
            			oViewModel.setData(oData.results); 
            			this.setModel(oViewModel,"WI");	            	 
        			
                 	}.bind(this),                 	
            		error: function(oError){  
            			this.setBusy(false);
            		}.bind(this), 
               });
            },
                        
            onSuccessRouteMatched:function(oEvent){              	
                if (this.getOwnerComponent().InitialLoaded != true ){
               	 this.getRouter().navTo("initialRoute");
               	 return;
               	}
	            var oModel = this.getModel('WI');           
		        var sPoId = oEvent.getParameter("arguments").PoId;     
		        var sIndex = oModel.oData.findIndex(function(currentValue,index,arr){        		
		        	return currentValue.Ebeln == sPoId;
		        },this);   		        	
		        oModel.oData.splice(sIndex,1);
		        oModel.setData(oModel.oData);    
            },
           	            				  
            _onItemPress : function(oEvent){  
            	var sPath = oEvent.getParameter("listItem").getBindingContext("WI").getPath();  
            	var oPo = this.getModel('WI').getProperty(sPath);
            	sPath = "/POInfoSet('" + oPo.Ebeln + "')";
	            this.getRouter().navTo(
	            		"detailRoute", {
	            			path:sPath.substr(1)
	            		}
	            ) 
            },
            
            handleRefresh:function(){
            	this._loadData();
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


