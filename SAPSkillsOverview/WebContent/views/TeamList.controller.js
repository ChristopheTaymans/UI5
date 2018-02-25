/**
 * SkillList controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPSkills.Application
 */
  
  
sap.ui.define(
    [
      "SAPSkillsOverview/Application/views/BaseController",
      'sap/ui/model/Filter',
      "sap/ui/model/json/JSONModel"
    ],
    function (BaseController, Filter,SAPJsonModel) {
        "use strict";
       
        return BaseController.extend("SAPSkillsOverview.Application.views.TeamList", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */       	
        	
            onInit: function () {       
            	this.getRouter().getRoute("initialRoute").attachPatternMatched(this._onInitialRouteMatched, this);
         	   if (!jQuery.support.touch) {     		
           		this.getView() .addStyleClass("sapUiSizeCompact");
           		}
            },
            
            _onItemPress : function(oEvent){
                var oItem = oEvent.getParameter("listItem");
                this.setInfo("TeamId",oItem.getProperty("intro")); 
            	this.setInfo("Team",oItem.getProperty("title")); 
            	this.getRouter().navTo(
            			"domainRoute", {
            				Team:oItem.getProperty("intro")
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
            
            onTeamSearch : function (oEvt) {
    			// add filter for search
    			var aFilters = [];
    			var sQuery = oEvt.getSource().getValue();
    			if (sQuery && sQuery.length > 0) {
    				var filter = new Filter("Auftxt", sap.ui.model.FilterOperator.Contains, sQuery);
    				aFilters.push(filter);
    			};
    			// update list binding
    			var list = this.getView().byId("lstTeam");
    			var binding = list.getBinding("items");
    			binding.filter(aFilters, "Application");    
    		},            
           
    		_onInitialRouteMatched:function(oEvent){    
   	            var oDataModel = this.getModel();             	 
               	var _this = this; 
               	_this.setBusy(true); 
               	oDataModel.read("/TeamSet" ,{                		
            		async: true,
            		success: function(oData, oResponse){   
            			_this.setBusy(false); 
            			_this._buildList( oData.results ); 
                 	},                 	
            		error: function(oError){      
            			_this.setBusy(false); 
            		}
            	});
    		},
               	
            _buildList : function(oData){ 	
//build the ALL line item          
           	 	var sAll =  {TeamId: 'ALL',
           			 	  Auftxt : this.getText("ALL"),
           	              Domnbr : 0
           	             };   
//summ all skill number into ALL item                 
                $.each(oData, function(key, value){
               	 sAll.Domnbr += value.Domnbr;   
               	 if (value.Missdev){sAll.Missdev=value.Missdev};
                });
//build models               
             var oViewModel = new SAPJsonModel([]); 	
// set the domains counter              
             this.setModel(new SAPJsonModel({Nbr: oData.length}),"TeamCount")
//insert ALL item il first place              
             oData.splice(0,0,sAll);              
          	 oViewModel.setData(oData);
             this.setModel(oViewModel, "Teams");  
            },
        });
    }
);


