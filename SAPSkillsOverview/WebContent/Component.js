/**
 * Main application component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPSkillsOverview.Application
 */
sap.ui.define(
	[
	 	"sap/ui/core/UIComponent",
	 	"sap/ui/model/json/JSONModel",
	],
	function(SAPUiComponent, SAPJsonModel){
		"use strict";
		
		$.sap.declare("SAPSkillsOverview.Application.Component");
		
		/**
		 * Definition of the component
		 */
		var oCmp = SAPUiComponent.extend("SAPSkillsOverview.Application.Component", {
			metadata:{
				manifest: "json"
			},
			
			
			init: function(){
				
				SAPUiComponent.prototype.init.apply(this, arguments);
				
				this.getRouter().initialize();		
				
				this.setModel(new SAPJsonModel(),
                "Info");
					
			}
			
			
		});
		
	}
);