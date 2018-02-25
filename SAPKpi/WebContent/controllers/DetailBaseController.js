/**
 * Detail controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	SAPKpi.Application
 */
  
  
sap.ui.define(
    [ "SAPKpi/Application/controllers/BaseController",      
      "sap/ui/model/odata/v2/ODataContextBinding",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
      "sap/ui/core/routing/History"
  ],
  function (BaseController, SAPODataContextBinding, SAPJsonModel, MessageToast, MessageBox,History) {
        "use strict";
       
        return BaseController.extend("SAPKpi.Application.controllers.DetailBaseController", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
            
        	onDetailRouteMatched:function(oEvent){
        		
        		 if (this.getInfo("loaded") != true ){
                	 this.getRouter().navTo("initialRoute");
                	 return;
                };
                
                if (this.getInfo("BeginDate") == undefined){
                    this._setDates();
                   };
                
                var sParameter = oEvent.getParameter("arguments").path;     
                this.sPath = '/' + sParameter + '/MeasureSet';
                var oDataModel = this.getModel();      
            	this.sBindingPath = '/' + sParameter;
            	var oDetailBindingCtx = new SAPODataContextBinding(oDataModel, this.sBindingPath);
            	this.getView().setBindingContext(oDetailBindingCtx);   
      	
            	this._loadData();   
        		
        	},
        	
            _loadData:function(){      
            	
            	var oDataModel = this.getModel();              	
                var oKpi = oDataModel.getProperty(this.sBindingPath);
            	var oMeasureModel = new SAPJsonModel();
            	var oTableModel = new SAPJsonModel();            	
            	var oCalendarModel = new SAPJsonModel();   
            	var oFilters = new Array(); 		            		
		        var oFilter = new sap.ui.model.Filter("Measdate", sap.ui.model.FilterOperator.BT, this.getInfo("BeginDate"), this.getInfo("EndDate"));		              			              		
		        oFilters.push(oFilter); 	 		
                	
               	this.setBusy(true);     
               	
               	oDataModel.read(this.sPath ,{                		
            		async: true,
            		filters : oFilters,
            		success: function(oData, oResponse){    
            			this.setBusy(false);
                      	 oMeasureModel.setData(oData.results);   
                      	 if (this.getInfo("FigureView")){
	                       	 var tableData = [];
	                         var calendar = {};
	                       	 var lineSIP = {};	                                   	 
	                         lineSIP.Entity = 'SIP';
	                       	 $.each(oData.results,function(key,sValue){	        
	                       		calendar["Month"+key] = sValue.Month;  
	                      		lineSIP["Measure"+key] = parseFloat(sValue.Measure1);  
	                      		if ( parseFloat(sValue.Measure1) > parseFloat(oKpi.RedInd)){
	                      			lineSIP["State"+key] = 'Error';
	                      		}
	                      		else if ( parseFloat(sValue.Measure1) > parseFloat(oKpi.YellowInd)){
	                      			lineSIP["State"+key] = 'None';
	                      		}
	                      		else 
	                      		{
	                      			lineSIP["State"+key] = 'Success';
	                      		};                     		
	
	                      		
	                       	 }.bind(this)
	                       	 );
	                       	tableData.push(lineSIP);	             
	                       	oTableModel.setData(tableData);
	                       	oCalendarModel.setData(calendar);
                      	
                       	this.setModel(oTableModel,"Measure");
                       	this.setModel(oCalendarModel,"Calendar");
                      	};                       	
                 	}.bind(this),                 	
            		error: function(oError){  
            			this.setBusy(false);
            		}.bind(this)
            	 }); 
               	
               	if (!this.getInfo("FigureView")){
    	            this.oVizFrame.setVizProperties({                   
    		              title: {
    		                  visible: true,
    		                  text:  oKpi.DescText
    		              }
    		            });
               		this.oVizFrame.setModel(oMeasureModel)
               	};    
            },
            
	        _setDates:function(){	        	
	            var sBeginDate= new Date(this.getInfo("EndDate").valueOf());
                sBeginDate.setFullYear(sBeginDate.getFullYear()-1);        
               	this.setInfo("BeginDate",sBeginDate);               	
	        },
	        
            onPeriodChange:function(oEvent){     
                this._setDates();
                this._loadData();            	
            },           
            
            onNavButtonPress:function(oEvent){
            	var oHistory = History.getInstance();
    			var sPreviousHash = oHistory.getPreviousHash();
    			if (sPreviousHash !== undefined) {
    				window.history.go(-1);
    			} else {    			
    				this.getRouter().navTo("initialRoute", true);
    			}
            }        	
        });
    }
);