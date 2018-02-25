/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	], function (Controller) {
		"use strict";

		return Controller.extend("SAPKpi.Application.controllers.BaseController", {
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
    		   		
    		setInfo:function(sProperty,sValue){
    			this.getOwnerComponent().getModel("Info").setProperty("/"+sProperty, sValue);
    		},
    		
    		getInfo:function(sProperty){
    			return this.getOwnerComponent().getModel("Info").getProperty("/"+sProperty);
    		},
    		
    		addMonth : function( pDatum, pAnzahlMonate )
    		{
    		    if ( pDatum === undefined )
    		    {
    		        return undefined;
    		    }

    		    if ( pAnzahlMonate === undefined )
    		    {
    		        return pDatum;
    		    }

    		    var vv = new Date();

    		    var jahr = pDatum.getFullYear();
    		    var monat = pDatum.getMonth() + 1;
    		    var tag = pDatum.getDate();

    		    var add_monate_total = Math.abs( Number( pAnzahlMonate ) );

    		    var add_jahre = Number( Math.floor( add_monate_total / 12.0 ) );
    		    var add_monate_rest = Number( add_monate_total - ( add_jahre * 12.0 ) );

    		    if ( Number( pAnzahlMonate ) > 0 )
    		    {
    		        jahr += add_jahre;
    		        monat += add_monate_rest;

    		        if ( monat > 12 )
    		        {
    		            jahr += 1;
    		            monat -= 12;
    		        }
    		    }
    		    else if ( Number( pAnzahlMonate ) < 0 )
    		    {
    		        jahr -= add_jahre;
    		        monat -= add_monate_rest;

    		        if ( monat <= 0 )
    		        {
    		            jahr = jahr - 1;
    		            monat = 12 + monat;
    		        }
    		    }

    		    if ( ( Number( monat ) === 2 ) && ( Number( tag ) === 29 ) )
    		    {
    		        if ( ( ( Number( jahr ) % 400 ) === 0 ) || ( ( Number( jahr ) % 100 ) > 0 ) && ( ( Number( jahr ) % 4 ) === 0 ) )
    		        {
    		            tag = 29;
    		        }
    		        else
    		        {
    		            tag = 28;
    		        }
    		    }

    		    return new Date( jahr, monat - 1, tag );
    		}

		});

	}
);
