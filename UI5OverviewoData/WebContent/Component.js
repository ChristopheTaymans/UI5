/**
 * UI5 Overview
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.oData
 */
sap.ui.define(
	[
	 	"sap/ui/core/UIComponent",
	 	"sap/ui/model/json/JSONModel"  //add the JSON module	 
	],
	function(SAPUiComponent, JSONModel){
		"use strict";

		return SAPUiComponent.extend("ui5.overview.oData.Component", {
			
		    metadata : {
/// point toward manifest for component properties 		 
/// in the manifest, the data source is defined toward the JSON file located in .models folder		    	
		    		manifest: "json"
				},
			
			init: function(){				
				SAPUiComponent.prototype.init.apply(this, arguments);							
				
	  			var info = {"fullScreen" : false};
	  		
	  			this.setModel(new JSONModel(info),"Info");	
				
// create the router				
				this.getRouter().initialize();	
												
			},
			
			destroy : function () {	
				SAPUiComponent.prototype.destroy.apply(this, arguments);
			},
									
		});
		
	}
);