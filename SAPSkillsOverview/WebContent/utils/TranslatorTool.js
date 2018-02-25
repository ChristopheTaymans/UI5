sap.ui.define(
    [
'sap/ui/model/json/JSONModel'
    ],function (JSONModel) {
        "use strict";        
        $.sap.declare("SAPSkillsOverview.Application.utils.TranslatorTool");
        
        jQuery.sap.require("sap.ui.core.Core");
        
        SAPSkillsOverview.Application.utils.TranslatorTool = {
        	 init: function(i18n){
        		 this.oI18n = i18n; 
        	 },
        	 getText: function(textId){
//        		 var oI18n = _this.getView().getModel("i18n");
        		 return this.oI18n.getProperty(textId);
                      	}
        	};        
        return SAPSkillsOverview.Application.utils.TranslatorTool;
    }
);