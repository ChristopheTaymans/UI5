/**
 * FullScreen controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPMobileSystemAvailibility.Application
 */

sap.ui.define(
    [   "SAPMobileSystemAvailibility/Application/controllers/BaseController",          
        "sap/ui/core/routing/History",
        "sap/ui/model/json/JSONModel",
        "sap/m/Link",
        "sap/m/Breadcrumbs"
    ],
    function (BaseController,History,SAPJsonModel,SAPLink,SAPBreadcrumbs) {
        "use strict";

        return BaseController.extend("SAPMobileSystemAvailibility.Application.controllers.Tiles", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
            onInit: function () {
            	this.getRouter().getRoute("levelRoute").attachPatternMatched(this._onLevelRoute, this);     
            	this.getRouter().getRoute("initialRoute").attachPatternMatched(this._onInitialRoute, this);           
            	this.oBreadCrumb = new SAPBreadcrumbs();
            	this.getView().byId("BreadcrumbContent").addContent(this.oBreadCrumb);
            },

            /**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
             * 
			 */
            onBeforeRendering: function () { },

            /**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
             * 
			 */
            onAfterRendering: function () { },

            /**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * 
			 */
            onExit: function () {
            },
            
            _onInitialRoute: function(oEvent){  
            	if ( this.getOwnerComponent().getComponentData() != undefined ){
                var oStartParameters = this.getOwnerComponent().getComponentData().startupParameters;
            	};
            	
				if (oStartParameters && oStartParameters.Branchid){ 					
					this.setInfo('BackButton', true);
					this._loadData(oStartParameters.Branchid[0]);
				}
				else
			    {
					this.setInfo('BackButton', false);
					this._loadData('');		
					this.getView().unbindElement();
			    };
			    this.oBreadCrumb.setVisible(false);
	            this.oBreadCrumb.setCurrentLocationText('');
			    if (this.oBreadCrumb.getLinks().length){
			    	this.oBreadCrumb.destroyLinks();			    	
			    };
            },
            
            _onLevelRoute: function(oEvent){               	
            	  this.setInfo('BackButton', true);	              	  
            	  var branchId = oEvent.getParameter("arguments").branchId;  
            	  this._loadData(branchId);	  
            	  if (branchId && this.getView().getBindingContext() ){   
            	   this.oBreadCrumb.setVisible(true);
	        	   this.oBreadCrumb.setCurrentLocationText(this.getModel().getProperty('Description',this.getView().getBindingContext()));	        	   
            	  }
            	  else
            	  {
            		this.oBreadCrumb.setVisible(false);
            	  };
            },   
            	              
	       _loadData:function(branchId){	    	
               var oDataModel = this.getModel();             	
               var oViewModel = new SAPJsonModel();       
	           var oFilters = new Array(); 	
	           if (branchId){	        	   
	        	   this.setInfo('HeaderVisible',true);
	              	var sBindingPath = "/AvailibilitySet('" + branchId + "')";             	
					this.getView().bindElement({
						path : sBindingPath,	
						events: {
							dataRequested : function () {
								this.setBusy(true);
							}.bind(this),
							dataReceived: function () {
								this.setBusy(false);								
							}.bind(this)
						}
					});					
			        var oFilter = new sap.ui.model.Filter("Branchid", sap.ui.model.FilterOperator.EQ, branchId);		              			              		
			        oFilters.push(oFilter); 				   
	           }
	           else
	           {
	        	   this.setInfo('HeaderVisible',false);
	           };     	
	               	this.setBusy(true); 
	               	oDataModel.read('/AvailibilitySet' ,{                		
	            		async: true,
	            		filters : oFilters,
	            		success: function(oData, oResponse){    
	            			this.setBusy(false);
	                      	 oViewModel.setData(oData.results);  	                      	
	                       	this.setModel(oViewModel,"Availibility");	               	
	                 	}.bind(this),                 	
	            		error: function(oError){  
	            			this.setBusy(false);	            		
	            		}.bind(this)
	            	 }); 	               	
            },
            
            _onPressTile:function(oEvent){                
            	var oContext = oEvent.getSource().getBindingContext('Availibility');   
            	var branchId  = this.getModel("Availibility").getProperty('Branchid',oContext);            	
            	var semanticObject = this.getModel("Availibility").getProperty('Semanticobj',oContext);
            	var navAction = this.getModel("Availibility").getProperty('Navaction',oContext);            	
            	if (semanticObject && navAction ){ 
            		var oCrossAppNavigation = this.getCrossAppNav();            		
            		var oTarget = { "target" : 
									{ "semanticObject" : semanticObject, 
									  "action": navAction 
									},            											
									"params" : { "branchId" : branchId }
						           }; 
            		oCrossAppNavigation.isNavigationSupported([oTarget]).done(
            				function(oResponses) { 
            					if (oResponses[0].supported===true){ 
            						oCrossAppNavigation.toExternal(oTarget);
            					};
            				});
            	}            	
            	else if ( this.getModel("Availibility").getProperty('Type',oContext) == 'S' ) 
            	{
		           	this._pushLink( );            		
            		this.getRouter().navTo(
			            		"levelRoute", {
			            			branchId:branchId
			            			}
			            ) 
	            }
            	else
                {           		
            	 	var targetId  = this.getModel("Availibility").getProperty('Targetid',oContext);
	           	       this.getRouter().navTo(
		            		"detailRoute", {
		            			TargetId:targetId
		            		}
		            )
                }; 
            },
            
            _pushLink:function(){
             	  var sAvailability = this.getModel().getProperty('',this.getView().getBindingContext());
             	  if (!sAvailability){
             		  sAvailability = {
             				     Description : this.getText('ALLSYSTEMS'),
             				     Branchid : '0'
                      };       
             	  }             	 
	 	        	  var oLink = new SAPLink( 
	 	        			   { 
	 	        				   text : sAvailability.Description,
	 	        				   target : sAvailability.Branchid	 	        				   
	 	        			   } 
	 	            
 	        	 );
	 	         oLink.attachPress(this._onLinkPress.bind(this));
 	        	 this.oBreadCrumb.addLink(oLink);
 	        	 var links = this.getInfo('Links').push(oLink);            
            },
            
            _popLink:function(){    
	 	        var oLink = this.getInfo('Links').pop();        	  
		        this.oBreadCrumb.removeLink(oLink);	   
		        return oLink;
            },          
            
            _onLinkPress:function(oEvent){        
            	var aTarget = oEvent.getSource().getProperty('target');
                var sPosition = 0;
            	do {
            	  var oLink = this._popLink();     
    			  sPosition--;
            	}
            	while (oLink.getProperty('target') != aTarget);            	
                window.history.go(sPosition);  
            },
            
            _onNavButton: function(){         
            	var oHistory = History.getInstance();
    			var sPreviousHash = oHistory.getPreviousHash();
    			if (sPreviousHash !== undefined) {
                    this._popLink();
    				window.history.go(-1);    			
    			} else {    				   			
    		   var oCrossAppNavigation = this.getCrossAppNav();    		   
				if (oCrossAppNavigation)
					{oCrossAppNavigation.backToPreviousApp();}				
    			else 
    				{this.getRouter().navTo("initialRoute");};		            
    			};
            }
        });
    }
);
