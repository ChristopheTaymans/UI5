/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		 "sap/ui/core/format/NumberFormat"
	], function (Controller,NumberFormat) {
		"use strict";

		return Controller.extend("SAPMobileSystemAvailibility.Application.controllers.BaseController", {
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
			getText : function (fTextId,fArgs) {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(fTextId,fArgs);
			},
			
    		setBusy:function(bState){
    			this.getView().setBusy(bState);
    		},
    		
    		getIcon: function(fValue){   
    			if( !fValue )
    				return "";
    			
    			var oImgSrc =  $.sap.getModulePath("SAPMobileSystemAvailibility.Application");	
    			
    			if (fValue.Icon){
    				oImgSrc += "/img/" + fValue.Icon;    
    			}
    			else
    				if (fValue.Type == 'S'){
		    		   {
		    				switch (fValue.Syststatus) {
		    			    case "0":
		    			    	oImgSrc += "/img/up.png";
		    			    	break;
		    			    case "1":
		    			    	oImgSrc += "/img/warning.png";
		    			        break;
		    			    case "2":
		    			    	oImgSrc += "/img/down.png";
		    			        break;    
		    				}
		    			};
    				}
    				else
    			    {
    					oImgSrc = this.getStatusIcon(fValue.Syststatus);
    			    };
    				 
    			return oImgSrc;
    		},
    		
    		getStatusIcon:function(status){
    			var oImgSrc =  $.sap.getModulePath("SAPMobileSystemAvailibility.Application");	
    			switch (status) {
					case "0":
						oImgSrc += "/img/computerUp.png";
						break;
					case "1":
						oImgSrc += "/img/warning.png";
						break;
					case "2":
						oImgSrc += "/img/computerDown.png";
						break;    
					}
	    		return oImgSrc;
    		},
    		
    		setTileNumber: function(value){  
    			
    			if (value.Noshownumber){
    				return null;
    			}    					
    			var locNumber = Number(value.Number);    			
    			if (Number.isInteger(locNumber)){
    				var numberFormat =  NumberFormat.getIntegerInstance({'groupingSeparator' : '.',
    																      'groupingEnabled' : true                
                       					});    		
    			}
    			else
    			{
    			 numberFormat =  NumberFormat.getFloatInstance({'decimalSeparator' : ',',
											                    'groupingSeparator': '.',
											                    'groupingEnabled' : true,
                                                                'decimals' : '2',
    			 												}
    			 				);
    			}
    			return numberFormat.format(locNumber);
    		},
    		   		   		
    		setInfo:function(sProperty,sValue){
    			this.getOwnerComponent().getModel("Info").setProperty("/"+sProperty, sValue);
    		},
    		
    		getInfo:function(sProperty){
    			return this.getOwnerComponent().getModel("Info").getProperty("/"+sProperty);
    		},
    		
    		getCrossAppNav:function(){
    			
     		   return sap.ushell && sap.ushell.Container && sap.ushell.Container.getService
				&& sap.ushell.Container.getService("CrossApplicationNavigation");
    		}
		});
	}
);
