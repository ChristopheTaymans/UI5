/**
 * Master controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPSkills.Application
 */
  
  
sap.ui.define(
    [
      'SAPSkillManage/Application/views/BaseController',
      'sap/ui/model/json/JSONModel',
      'sap/ui/model/Filter',
      ],
      function (BaseController, SAPJsonModel, Filter) {       
        return BaseController.extend("SAPSkillManage.Application.views.Master", {            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */       	
        	
            onInit: function () {       
            	var sSaved = { "Save": true};
            	this.getOwnerComponent().setModel(new SAPJsonModel(sSaved),"Saved");    
         	   	if (!jQuery.support.touch) {     		
         	   		this.getView() .addStyleClass("sapUiSizeCompact");
           		}
            },
            
            _onItemPress : function(oEvent){            	
            	var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();                
            	if (this.getModel("Saved").getData().Save){
	            	this.getRouter().navTo(
	            			"skillRoute", {
	            				Skill:sPath.substr(1)
	            			}
	            		)  
            	}
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
            
           	            				  
            handleCreatePress: function() {         	
        		 this.getRouter().navTo(
            			"createRoute"
            		)
        	},         	
        });
    }
);


