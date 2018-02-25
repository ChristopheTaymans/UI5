/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	], function (Controller,History) {
		"use strict";

		return Controller.extend("ui5.overview.routing2.controllers.BaseController", {
  		
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},
			
            onNavButton: function(){         
            	var oHistory = History.getInstance();
    			var sPreviousHash = oHistory.getPreviousHash();
    			if (sPreviousHash !== undefined) {
    				window.history.go(-1);
    			} else {
    		    	this.getRouter().navTo("initialRoute", true);
    			}
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
			getText : function (fTextId,fArgs) {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(fTextId,fArgs);
			},
			
    		setBusy:function(bState){
    			this.getView().setBusy(bState);
    		},
    		
    		setInfo:function(sProperty,sValue){
    			this.getOwnerComponent().getModel("Info").setProperty("/"+sProperty, sValue);
    		},
    		
    		getInfo:function(sProperty){
    			return this.getOwnerComponent().getModel("Info").getProperty("/"+sProperty);
    		},
    		
    		weightState :  function (fMeasure, sUnit) {

    			// Boarder values for different status of weight
    			var fMaxWeightSuccess = 1;
    			var fMaxWeightWarning = 5;
    			var fAdjustedMeasure = parseFloat(fMeasure);

    			// if the value of fMeasure is not a number, no status will be set
    			if (isNaN(fAdjustedMeasure)) {
    				return "None";
    			} else {

    				if (sUnit === "G") {
    					fAdjustedMeasure = fMeasure / 1000;
    				}

    				if (fAdjustedMeasure < 0) {
    					return "None";
    				} else if (fAdjustedMeasure < fMaxWeightSuccess) {
    					return "Success";
    				} else if (fAdjustedMeasure < fMaxWeightWarning) {
    					return "Warning";
    				} else {
    					return "Error";
    				}
    			}
    		} ,
    		
    		stockStatus : function(sStock){
    			if (sStock > 5){ return 'Success'}
    			else if (sStock > 2){ return 'Warning'}
    			else return 'Error'
    		}
    		
    		
		}
	)	
});
