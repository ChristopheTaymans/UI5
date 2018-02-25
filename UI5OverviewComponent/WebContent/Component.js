/**
 * UI5 Overview
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.simplest
 */
sap.ui.define(
	[
	 	"sap/ui/core/UIComponent"
	],
	function(SAPUiComponent){
		"use strict";		
	
		/**
		 * simplest Definition of the component
		 */
		return SAPUiComponent.extend("ui5.overview.simplest.Component", {
			
		    metadata : {
					rootView: "ui5.overview.simplest.views.Main"
				},
			
			init: function(){
				 // call the init function of the parent
				SAPUiComponent.prototype.init.apply(this, arguments);		
												
			},
			
			destroy : function () {				
				// call the base component's destroy function
				SAPUiComponent.prototype.destroy.apply(this, arguments);
			},
									
		});		
	}
);