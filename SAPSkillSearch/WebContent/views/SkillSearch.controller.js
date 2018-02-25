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
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter"
    ],
    function (BaseController,SAPJsonModel,Filter) {
        "use strict";

        return BaseController.extend("SAPSkillsSearch.Application.views.SkillSearch", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            onInit: function () {
            	this.getRouter().getRoute("searchRoute").attachPatternMatched(this._onSearchRouteMatched, this);
            	var oExtraModel = new SAPJsonModel([]); 
            	this.setModel(oExtraModel,"Selected"); 
//      		  	var oPage = this.getView().byId("content");       		  
//      		  	var _this = this;
//      		  	oPage.onAfterRendering = function() {  
//      		  		_this._onDrop(oPage);
//      		  	}
            },           
  		  
//  		  _onDrop:function(oSource){
//  			  var iD = oSource.getId();        			   			  
//  			  var _this = this;       			      
//       			$("#"+iD).droppable({  
//       			  drop: function( event, ui ) {  
//       			  var listElementId = ui.draggable.context.id;  
//       			  var draggedElement = sap.ui.getCore().byId(listElementId);  
//       			  
//       			  _this._addSelected(draggedElement);
//       			    
//       			  }  
//       			}) 
//            },
            
            _addSelected:function(oInput){            	
            	  var oExtraModel = this.getModel("Selected");     			  
     			  var oData = oExtraModel.getData(); 
       			  oData.push(
    					 {
    						  Skill : oInput.getProperty("intro"),
    						  Desc : oInput.getProperty("title"),
    						  Required : true
    					  }	  
    			  );
     			 oExtraModel.setData(oData);
     			 this.setModel(oExtraModel,"Selected");
            },
            
            _onSwitch:function(oEvent){
            	var sPath = oEvent.getSource().getParent().getBindingContext("Selected").getPath();
            	this.getModel("Selected").setProperty(sPath+"/Required",oEvent.getParameter("state"));
            },
            
            _onSearch:function(oEvent){     
            	var oSelected = this.getModel("Selected").getData();
            	var oFilters = new Array();
                $.each(oSelected, function (index, value) {
            		var requiredFlag = "X";
            		if (!value.Required){requiredFlag = ""};
            			var sPattern = value.Skill + '!' + requiredFlag;
            		   	var oFilter = new Filter('SearchParameter', sap.ui.model.FilterOperator.EQ, sPattern, '');
                        oFilters.push(oFilter); 
            		});   
            	this.getModel("SkillSearchFilters").setData(oFilters,false);
            	this.getRouter().navTo(
            			"resultRoute"
            		)            	
            },
            
            _onDeleteItem:function(oEvent){
            	var sPath = oEvent.getParameter("listItem").getBindingContext("Selected").getPath();
            	var oModel = this.getModel("Selected");
            	var oSelected = oModel.getData();
            	oSelected.splice(sPath.substr(1,1),1);
            	oModel.setData(oSelected);
            },
            
            _onSearchRouteMatched:function(oEvent){
            	if (oEvent.getParameter("arguments").Skill){
		            var oItem = this.getModel("Item");
			        this._addSelected(oItem.getData());
			        oItem.setData();
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
            onExit: function () { }
        });
    }
);
