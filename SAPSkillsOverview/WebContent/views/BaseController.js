/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	], function (Controller) {
		"use strict";

		return Controller.extend("SAPSkillsOverview.Application.views.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},
			
			getText : function (fTextId) {
				return this.getResourceBundle().getText(fTextId);
			},
			
        	returnFloat: function(fValue) { 
    		    return parseFloat(fValue);
    		},
    		
    		setInfo:function(sProperty,sValue){
    		 this.getModel("Info").setProperty("/" + sProperty,sValue); 
    		},
    		
    		getIcon: function(fValue){        		
	    	    var oImgSrc =  $.sap.getModulePath("SAPSkillsOverview.Application");		    	    
	    		if ( fValue === true || fValue === 0) {
	    				oImgSrc += "/img/thumbDown.png";
	    			}
	    		else
	    			{
	    			    oImgSrc += "/img/thumbUp.png";
	    			} 	
	    		return oImgSrc;
    		},
    		
    		getIcon2: function(fValue){        		
	    	    var oImgSrc =  $.sap.getModulePath("SAPSkillsOverview.Application");		    	    
	    		if ( fValue === true || fValue === 0) {
	    				 oImgSrc += "/img/thumbUp.png";
	    			} 	
	    		return oImgSrc;
    		},
    		
    		setBusy:function(bState){
    			this.getView().setBusy(bState);
    		}
    		
		});

	}
);
