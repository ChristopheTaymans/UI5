/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPNotification.Application
 */
  
  
sap.ui.define(
    [ "SAPNotification/Application/controllers/BaseController",      
      "sap/ui/model/odata/v2/ODataContextBinding",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
      "sap/ui/core/routing/History",
      'sap/ui/model/Filter'
  ],
  function (BaseController, SAPODataContextBinding, SAPJsonModel, MessageToast, MessageBox,History,Filter) {
        "use strict";
       
        return BaseController.extend("SAPNotification.Application.controllers.Detail", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	        	
            onInit: function () {              	
            	this.getRouter().getRoute("detailRoute").attachPatternMatched(this.onDetailRouteMatched, this);
            	this.getRouter().getRoute("createRoute").attachPatternMatched(this.onDetailRouteMatched, this);	 
            	this.oDisplayFragment = sap.ui.xmlfragment("SAPNotification.Application.views.Display", this);	
				this.oCreateFragment = sap.ui.xmlfragment("SAPNotification.Application.views.Create", this);
				sap.ui.getCore().attachValidationError(function (oEvent) { 
				      oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);  
				  });  
				sap.ui.getCore().attachValidationSuccess(function (oEvent) {  
				      oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);  
				  });  
	        },  
	
            onExit: function () { 
				this.oDisplayFragment.destroy();
				this.oCreateFragment.destroy();				
            },           

            
            onDetailRouteMatched: function(oEvent){     
            	// if initial load is not occured, it means that the user send an URL not appropriate -> restart at initial route
                if (this.getInfo("loaded") != true ){                	
                	 this.getRouter().navTo("initialRoute");
                	 return;
                }; 
                var oModel = this.getModel();  
                if (this.getInfo("Create")){
                // creation mode                	
                	if ( this.getModel('Service').getProperty('/root') == undefined){
                		// load groupe and code to build both tree for value help
                  		this.setBusy(true);                  		
                  		oModel.read("/GroupCodeSet" ,{                		
                    		async: false,
                    		success: function(oData, oResponse){
                    			// build Service tree node
                    			 this.setBusy(false);  
                    			 var oTree = {"root": []};                        	         
                    	         var codegruppe = '';
                    	         var code = {};
                    	         var group = {};
                                 $.each(oData.results, function(key, data){ 
                                	 if( codegruppe != data.Codegruppe){ 
                                		 group = {};
                                		 codegruppe = data.Codegruppe;
                                		 group.Code = data.Codegruppe;
                                		 group.Descr = data.Qktextgr;   
                                		 group.Link = false;
                                		 group.items = [];
                                		 oTree.root.push(group);
                  			         };
                  			         code = {};
                  			         code.Codegruppe = data.Codegruppe;
                  			         code.Code = data.Code;
                  			         code.Descr = data.Qktextco;
                  			         code.Link = true;
                  			         group.items.push(code);  
                                 }.bind(this))
                                 this.getModel('Service').setData(oTree);	
                         	}.bind(this),                 	
                    		error: function(oError){  
                    			this.setBusy(false);
                    		}.bind(this)
                    	 });                  		
                  		oModel.read("/UrgenceSet" ,{                		
                    		async: false,
                    		success: function(oData, oResponse){ 
                    			// build Urgency tree node
                    			this.setBusy(false);  
                    			var oTree = {"root": []};                        	         
                    	         var codegruppe = '';
                    	         var code = {};
                    	         var group = {};
                                 $.each(oData.results, function(key, data){                                    	                                    	  
                                	
                                	 if( codegruppe != data.Codegruppe){ 
                                		 group = {};
                                		 codegruppe = data.Codegruppe;                                    		 
                                		 group.Code = data.Codegruppe;
                                		 group.Descr = data.Qktextgr;  
                                		 group.Link = false;
                                		 group.items = [];
                                		 oTree.root.push(group);
                  			         };
                  			         code = {};
                  			         code.Codegruppe = data.Codegruppe;
                  			         code.Code = data.Code;
                  			         code.Link = true;
                  			         code.Descr = data.Qktextco;  
                  			         group.items.push(code); 
                                 }.bind(this))
                                 this.getModel('Urgence').setData(oTree);	
                         	}.bind(this),                 	
                    		error: function(oError){  
                    			this.setBusy(false);
                    		}.bind(this)
                    	 });  
                    	}
                		var oNewModel = this.setModel(new SAPJsonModel(),"New");  
                		this.setModel(new SAPJsonModel([]),"NewPartner");  
                		this.setBusy(true);
                		// get the next free notification number
                      	oModel.read("/NewNumberSet('')" ,{                		
                    		async: true,
                    		success: function(oData, oResponse){    
                    			this.setBusy(false);
        	            	    this.getModel('New').setProperty('/Qmnum',oData.ExQmnum);   
        	            	    this._toggleButtonsAndView(true);
                         	}.bind(this),                 	
                    		error: function(oError){  
                    			this.setBusy(false);
                    		}.bind(this)
                    	 }); 
                }
                else
                {
                	this._toggleButtonsAndView(false);
				    var oModel = this.getModel();
				    var sParameter = oEvent.getParameter("arguments").path;     
				 	var sBindingPath = '/' + sParameter;
				 	var oDetailBindingCtx = new SAPODataContextBinding(oModel, sBindingPath);
				 	this.getView().setBindingContext(oDetailBindingCtx); 
                 };  
                }, 
             
            //manage the content and button vivibility of the detail view Vs. creation/display mode    
            _toggleButtonsAndView : function (bEdit) {
        			var oView = this.getView();
        			var oPage = this.getView().byId("page");  
        			if( this.getInfo("Create")){
        				oView.byId("save").setVisible(true); 
        				oView.byId("cancel").setVisible(true); 
        			}
        			else
        		    {
        				oView.byId("save").setVisible(false);
        				oView.byId("cancel").setVisible(false); 
        			};
        			if (bEdit){
        				oPage.removeContent("DisplayBox");    			
        				oPage.addContent(this.oCreateFragment);   
                    	this.setInfo("Saved",false);
                    }
        			else
        			{
        				oPage.removeContent("CreateBox");   
        				oPage.addContent(this.oDisplayFragment);    			
        		    	this.setInfo("Saved",true);
        			};    		 
        	},           
            
        	// save dispatcher
            onSave:function(oEvent){             	
            	var oNewEntry = this.getModel("New").oData;  
            	//check first if required entry are fullfiled
                if (oNewEntry.Qmtxt == null||
                	oNewEntry.Ltrmn == undefined|| oNewEntry.Strmn == undefined ||
                	oNewEntry.Qmgrp == null|| oNewEntry.Qmcod == null ||
                	oNewEntry.Fegrp == null|| oNewEntry.Fecod == null ||
                	oNewEntry.Pcnumber == null|| oNewEntry.Category == undefined
                	){
	                	MessageToast.show(this.getText("REQUIRED_VALUE"));
	                	return;
                	  }
                if (oNewEntry.Qmtxt.trim() == ""){
                	MessageToast.show(this.getText("REQUIRED_VALUE"));
                	return;
            	};
    			MessageBox.confirm(
    				this.getText("CONFIRMATION"),{    						
    					onClose: function(oAction){
    						if (oAction=='OK'){
    							this._save(); 
    						}    						
    					}.bind(this)
    				}
    			);            	           	
            },
            
            // save Notification header
            _save:function(){             	
            	var oDataModel = this.getModel();  
            	var oNewEntry = this.getModel("New").oData;   
            	oDataModel.create('/NotificationHeaderSet',oNewEntry, {                		
            		success: function(oData,response){ 
            			this._savePartner();            			
                 	}.bind(this),                 	
            		error: function(oError){  
            			this._showError(oError);
            		}.bind(this)
            	 });            	
            },
            
            // save partenrs
            _savePartner:function(){            	
            	var oPartner = this.getModel("NewPartner").getData();
            	var counter = oPartner.length;            	
            	if (counter==0){
	               	 MessageToast.show(this.getText("SAVED"),{closeOnBrowserNavigation:false });
	       			this._toggleButtonsAndView(false);
	       			this.getRouter().navTo("initialRoute", true);  
	       			return;
            	}
            	$.each(oPartner,function(key, partner){            		
            		this.setBusy(true); 
            		this.getModel().create('/PartnerSet',partner, {    
	              		async: true,
	            		success: function(oData,response){  
	            			this.setBusy(false); 
	            			counter--;
	                          if (counter == 0 ){
	                        	 MessageToast.show(this.getText("SAVED"),{closeOnBrowserNavigation:false });
	                  			this._toggleButtonsAndView(false);
	                  			this.getRouter().navTo("initialRoute", true);                     	
	                          };
	                 	}.bind(this),                 	
	            		error: function(oError){ 
	            			this._showError(oError);             			
	            		}.bind(this)
	            	 }); 
            	}.bind(this));                        	
            },   
            
            // show saving error
            _showError:function(oError){
            	this.setBusy(false); 
            	var errorTxt = JSON.parse(oError.responseText).error.message.value;  
				MessageToast.show(errorTxt,{closeOnBrowserNavigation:false });  
				this._toggleButtonsAndView(false);
				this.getRouter().navTo("initialRoute", true);  
            },
            
            // Cancel creation mode
            onCancel:function(oEvent){   
            	this.getRouter().navTo("initialRoute", true);         	
            },
            
            // add a new line in the partner creation table
            onCreatePartner:function(){   
            	var oRow = {             			
            			"Qmnum" : this.getModel('New').getProperty('/Qmnum')
            				};  
            	var odata = this.getModel('NewPartner').getData();
            	odata.push(oRow);            	
            	this.getModel('NewPartner').setData(odata);
            },
            
            // delete a partner from the partner table
            _onDeleteItem:function(oEvent){            
      	    	var sPath = oEvent.getParameter("listItem").getBindingContext("NewPartner").getPath();
            	var oModel = this.getModel("NewPartner");
            	var oData = oModel.getData();         
            	oData.splice(sPath.substr(1),1);
            	oModel.setData(oData); 
            },
            
            // check dates 
            onDateChange:function(oEvent){            	
            	var Notif = this.getModel('New').getProperty("/");            	
            	if (Notif.Strmn != undefined && Notif.Ltrmn != undefined  ){
            		if (Notif.Strmn > Notif.Ltrmn  ){
            			sap.ui.getCore().byId('StartDate').setValueState(sap.ui.core.ValueState.Error);
            			sap.ui.getCore().byId('EndDate').setValueState(sap.ui.core.ValueState.Error);    
            			MessageToast.show(this.getText("DATEOVERLAP"),{closeOnBrowserNavigation:false });
            			return;
            		}
            	};            	
    			sap.ui.getCore().byId('StartDate').setValueState(sap.ui.core.ValueState.None);
    			sap.ui.getCore().byId('EndDate').setValueState(sap.ui.core.ValueState.None);             	
            },      
            
       // Service value help management            
            //Open the tree to select the service
            onServiceRequest:function(){         
            	this.oTreeFragment = sap.ui.xmlfragment("SAPNotification.Application.views.ServiceTree", this);
            	this.getView().addDependent(this.oTreeFragment);  
            	this.oTreeFragment.setModel(this.getModel("Service"));
            	this.oTreeFragment.open();
            },
            
            // a service has been selected
            _onServicePress:function(oEvent){           	
               	this.oTreeFragment.close();   
            	var sPath = oEvent.getSource().getParent().getBindingContext("Service").getPath();
            	var sBranch = this.getModel("Service").getProperty(sPath);
            	//update both fields
            	this.getModel("New").setProperty("/Fegrp",sBranch.Codegruppe);
            	this.getModel("New").setProperty("/Fecod",sBranch.Code); 
            },

       // Urgency value help management            
            //Open the tree to select the urgency
            onUrgenceRequest:function(){         
            	this.oTreeFragment = sap.ui.xmlfragment("SAPNotification.Application.views.UrgenceTree", this);
            	this.getView().addDependent(this.oTreeFragment);  
            	this.oTreeFragment.setModel(this.getModel("Urgence"));
            	this.oTreeFragment.open();
            },          
             		
            // an urgence has been selected
            _onUrgencePress:function(oEvent){           	
               	this.oTreeFragment.close();   
            	var sPath = oEvent.getSource().getParent().getBindingContext("Urgence").getPath();
            	var sBranch = this.getModel("Urgence").getProperty(sPath);
            	this.getModel("New").setProperty("/Qmgrp",sBranch.Codegruppe);
            	this.getModel("New").setProperty("/Qmcod",sBranch.Code); 
            },
            
       //User selection management
            // check taht user exist and fullfill the name and Email
            onUserChange:function(oEvent){            	
            	var oModel = this.getModel();
            	var sId = oEvent.getParameter("id");
            	var oPartnerModel = this.getModel("NewPartner");
            	var sPath = "/UserSet('" + oEvent.getParameter("value") + "')";
            	var sRow = oEvent.getSource().getParent().getBindingContext("NewPartner").getPath();
            	// send a request to get the user
            	oModel.read(sPath,{
            		async : true,
            		success: function(oData,response){  
            			this.setBusy(false);   
            			// oData provide a '#' if user is not found
            			if ( oData.Uname != '#'){
            			    //user exist --> full fill name and email field
	            			oPartnerModel.setProperty(sRow +"/Fullname", oData.Fullname );
	            			oPartnerModel.setProperty(sRow +"/EMail", oData.EMail );
	            			sap.ui.getCore().byId(sId).setValueState(sap.ui.core.ValueState.None);   
            			}
            			else
            			{   //user does not exist --> clear name and email field
            				oPartnerModel.setProperty(sRow +"/Fullname", '' );
                			oPartnerModel.setProperty(sRow +"/EMail", '' );
                			//set user field in error state
            		        sap.ui.getCore().byId(sId).setValueState(sap.ui.core.ValueState.Error);   
            			};
                 	}.bind(this)  
            	})
            }, 
            
            // open the value help fragment to selct the user
            onUserRequest:function(oEvent){
            	this.sUserPath = oEvent.getSource().getParent().getBindingContext("NewPartner").getPath();
            	this.oUserFragment = sap.ui.xmlfragment("SAPNotification.Application.views.SelectUser", this);
            	this.getView().addDependent(this.oUserFragment);  
            	this.oUserFragment.setModel(this.getModel());
            	this.oUserFragment.open();
            },            
            
            // user selected or selection canceled
            onUserClose: function(oEvent) {  
    			var aContexts = oEvent.getParameter("selectedContexts");    			
    			if (aContexts.length) {
    				// a user has been selected
    				var user= aContexts.map(function(oContext) { return oContext.getObject(); }); 
	                this.getModel("NewPartner").setProperty(this.sUserPath+"/Uname",user[0].Uname);
	                this.getModel("NewPartner").setProperty(this.sUserPath+"/Fullname",user[0].Fullname);
	                this.getModel("NewPartner").setProperty(this.sUserPath+"/EMail",user[0].EMail);                  
            	}
             },  
    		
             onUserSearch: function(oEvent) {
    			var aFilters = [];
    			var sValue = oEvent.getParameter("value");
    			if (sValue && sValue.length > 0) {
    			var oFilter = new Filter("Fullname", sap.ui.model.FilterOperator.Contains, sValue);
    			aFilters.push(oFilter);
    			};
    			var oBinding = oEvent.getSource().getBinding("items");
    			oBinding.filter(aFilters, "Application"); 
    		},  
    		
            onClose:function(){            	
            	this.oTreeFragment.close();
            	this.oTreeFragment.destroy();	
            },     		

            onNavButtonPress:function(oEvent){
            	if (this.getInfo("Saved")){
	            	var oHistory = History.getInstance();
	    			var sPreviousHash = oHistory.getPreviousHash();
	    			if (sPreviousHash !== undefined) {
	    				window.history.go(-1);
	    			} else {    			
	    				this.getRouter().navTo("initialRoute", true);
	    			}
            	};    			
            }, 
        });
    }
);


