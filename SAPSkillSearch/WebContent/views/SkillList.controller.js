/**
 * Main controler component
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
        ],
        function (BaseController, Filter) {
        "use strict";

        return BaseController.extend("SAPSkillsSearch.Application.views.SkillList", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
                   	
            	
                onInit: function () {   
            },
            
            _onUpdateFinished: function(oEvent){            	
//            	var oSource = this.getView().byId("lstSkill");  
//         		var listId = oSource.getId();  
//         		var listUlId = "#"+listId //list id
//         		               + "-listUl li";   // add the this to build the id of an item in the list
//         		  
//     
//         		 $(listUlId).draggable({  
//         			          helper: "clone"
//         			      });   
            },
            
            _onItemPress : function(oEvent){
            	var oItem = oEvent.getParameter("listItem");
            	this.getModel("Item").setData(oItem);
            	this.getRouter().navTo(
            			"searchRoute", {
            				Skill:encodeURIComponent(oItem.getProperty("intro"))
            			}
            		)  
            },
 
            
            onSkillSearch : function (oEvt) {
    			// add filter for search
    			var aFilters = [];
    			var sQuery = oEvt.getSource().getValue();
    			if (sQuery && sQuery.length > 0) {
    				var filter = new Filter("ShortDesc", sap.ui.model.FilterOperator.Contains, sQuery);
    				aFilters.push(filter);
    			};
    			// update list binding
    			var list = this.getView().byId("lstSkill");
    			var binding = list.getBinding("items");
    			binding.filter(aFilters, "Application");    
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
            onExit: function () { }
        });
    }
);
