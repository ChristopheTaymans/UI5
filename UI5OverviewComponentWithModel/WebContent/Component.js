/**
 * UI5 Overview
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.comp.model
 */
sap.ui.define(
	[
	 	"sap/ui/core/UIComponent",
	 	"sap/ui/model/json/JSONModel"  //add the JSON module
	],
	function(SAPUiComponent, JSONModel){
		"use strict";		
	
		/**
		 * simplest Definition of the component
		 */
		return SAPUiComponent.extend("ui5.overview.comp.model.Component", {
			
		    metadata : {
					rootView: "ui5.overview.comp.model.views.Main"
				},
			
			init: function(){
				 // call the init function of the parent
				SAPUiComponent.prototype.init.apply(this, arguments);		
				
// create a JSON model for the component				
				this.setModel( new JSONModel(),"appData");		
												
			},
			
			destroy : function () {				
				// call the base component's destroy function
				SAPUiComponent.prototype.destroy.apply(this, arguments);
			},
									
		});
		
	}
);