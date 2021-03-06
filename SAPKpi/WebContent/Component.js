/**
 * Main application component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPKpi.Application
 */
sap.ui.define(
	[
	 	"sap/ui/core/UIComponent",
	 	"sap/ui/model/json/JSONModel",
	 	"SAPKpi/Application/controllers/ErrorHandler",
	 	"SAPKpi/Application/model/models",
	],
	function(SAPUiComponent, SAPJsonModel, ErrorHandler,models){
		"use strict";
		
//		$.sap.declare("SAPKpi.Application.Component");
		
		/**
		 * Definition of the component
		 */
		return SAPUiComponent.extend("SAPKpi.Application.Component", {
			metadata:{
				manifest: "json"
			},
			
			
			init: function(){
				
				SAPUiComponent.prototype.init.apply(this, arguments);
				
				// initialize the error handler with the component
				
				this._oErrorHandler = new ErrorHandler(this);
				
    			var info = {
    					"actualCount":0,
    					"totalCount":0,
    					"BeginDate" : undefined,
    					"EndDate" : new Date(),  
    					"FigureView" : false,
    					"loaded" : false
    			};
    			this.setModel(new SAPJsonModel(info),"Info");	
    			
				this.setModel(models.createDeviceModel(), "DEVICE");
				this.getRouter().initialize();	
				
			},
			
			destroy : function () {
				
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				SAPUiComponent.prototype.destroy.apply(this, arguments);
			},
			
			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!jQuery.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}
			
			
		});
		
	}
);