/**
 * UI5 Overview
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.dynamictoolbar
 */
sap.ui.define(
	[
	 	"sap/ui/core/UIComponent"
	],
	function(SAPUiComponent){
		"use strict";		
	
		/**
		 * dynamictoolbar Definition of the component
		 */
		return SAPUiComponent.extend("ui5.overview.dynamictoolbar.Component", {
			
		    metadata : {
					rootView: "ui5.overview.dynamictoolbar.views.Main"
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