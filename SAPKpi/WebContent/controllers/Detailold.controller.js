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
       
        return BaseController.extend("SAPKpi.Application.controllers.Detail", {
            /**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
        	        	
            onInit: function () {              	
            	this.getRouter().getRoute("chartRoute").attachPatternMatched(this.onChartRouteMatched, this);
            	this.getRouter().getRoute("figureRoute").attachPatternMatched(this.onFigureRouteMatched, this);                 	
                this.oVizFrame = this.getView().byId("idVizFrame");
                if (this.oVizFrame){
                    var oPopOver = this.getView().byId("idPopOver");
                    oPopOver.connect(this.oVizFrame.getVizUid());
                }

	        },  
	        

            /**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
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
			 * @author		Christophe Taymans
			 * @version		1.0.0
			 * @since		1.0.0
			 * @memberOf	CTA.Test.ODataTest
			 */		
            onExit: function () { },           

            
            onChartRouteMatched: function(oEvent){  
             
                if (this.getInfo("loaded") != true ){
                	 this.getRouter().navTo("initialRoute");
                	 return;
                };
                
                if (this.sEndDate == undefined){
                 this._setDates(new Date());
                };
                
                var sParameter = oEvent.getParameter("arguments").path;     
                this.sPath = '/' + sParameter + '/MeasureSet';
                var oDataModel = this.getModel();      
            	this.sBindingPath = '/' + sParameter;
            	var oDetailBindingCtx = new SAPODataContextBinding(oDataModel, this.sBindingPath);
            	this.getView().setBindingContext(oDetailBindingCtx);   
      	
            	this._loadData();   

            },
            
            onFigureRouteMatched: function(oEvent){  
                
                if (this.getInfo("loaded") != true ){
                	 this.getRouter().navTo("initialRoute");
                	 return;
                };
                
                if (this.sEndDate == undefined){
                 this._setDates(new Date());
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
		        var oFilter = new sap.ui.model.Filter("Measdate", sap.ui.model.FilterOperator.BT, this.sBeginDate, this.sEndDate);		              			              		
		        oFilters.push(oFilter); 	 		
                	
               	this.setBusy(true);     
               	
               	oDataModel.read(this.sPath ,{                		
            		async: true,
            		filters : oFilters,
            		success: function(oData, oResponse){    
            			this.setBusy(false);
                      	 oMeasureModel.setData(oData.results);                      	 
                       	 var tableData = [];
                         var calendar = {};
                       	 var lineSIP = {};
                       	 var lineSHP = {};                       	 
                         lineSIP.Entity = 'SIP';
                         lineSHP.Entity = 'SHP';
                       	 $.each(oData.results,function(key,sValue){
                       		calendar["Month"+sValue.Month.substr(0,2)] = sValue.Month;  
                      		lineSIP["Measure"+sValue.Month.substr(0,2)] = parseFloat(sValue.Measure1);  
                      		if ( parseFloat(sValue.Measure1) > parseFloat(oKpi.RedInd)){
                      			lineSIP["State"+sValue.Month.substr(0,2)] = 'Error';
                      		}
                      		else if ( parseFloat(sValue.Measure1) > parseFloat(oKpi.YellowInd)){
                      			lineSIP["State"+sValue.Month.substr(0,2)] = 'None';
                      		}
                      		else 
                      		{
                      			lineSIP["State"+sValue.Month.substr(0,2)] = 'Success';
                      		};
                      		
                      		lineSHP["Measure"+sValue.Month.substr(0,2)] = parseFloat(sValue.Measure2);  
                      		
                      		if ( parseFloat(sValue.Measure2) > parseFloat(oKpi.RedInd)){
                      			lineSHP["State"+sValue.Month.substr(0,2)] = 'Error';
                      		}
                      		else if ( parseFloat(sValue.Measure2) > parseFloat(oKpi.YellowInd)){
                      			lineSHP["State"+sValue.Month.substr(0,2)] = 'None';
                      		}
                      		else 
                      		{
                      			lineSHP["State"+sValue.Month.substr(0,2)] = 'Success';
                      		};
                      		
                       	 }.bind(this)
                       	 );
                       	tableData.push(lineSIP);
                       	tableData.push(lineSHP);
                       	oTableModel.setData(tableData);
                       	oCalendarModel.setData(calendar);
                       	this.setModel(oTableModel,"Measure")  ;
                       	this.setModel(oCalendarModel,"Calendar")  ;
                 	}.bind(this),                 	
            		error: function(oError){  
            			this.setBusy(false);
            		}.bind(this)
            	 }); 
               	
               	if (this.oVizFrame != undefined ){
    	            this.oVizFrame.setVizProperties({                   
    		              title: {
    		                  visible: true,
    		                  text:  oKpi.DescText
    		              }
    		            });
               		this.oVizFrame.setModel(oMeasureModel)
               	};    
            },
            
	        _setDates:function(sEndDate){	        	
	            this.sEndDate = new Date(sEndDate.valueOf());
//	            this.sEndDate.setDate("1");
//	            this.sEndDate = this.addMonth(this.sEndDate,1);
	            this.sBeginDate= new Date(sEndDate.valueOf());
                this.sBeginDate.setFullYear(sEndDate.getFullYear()-1);
                debugger;
               	var oDateModel = new SAPJsonModel({"EndPeriod":this.sEndDate});
               	this.setModel(oDateModel,"Period");
	        },
	        
            onPeriodChange:function(oEvent){     
            	var oEndperiod = this.getModel("Period").getProperty("/EndPeriod");
                this._setDates(oEndperiod);
                this._loadData();
            	
            },
            
            _onChart:function(oEvent){            
            	var sPath= this.getView().getBindingContext().getPath(); 
            	 this.getRouter().navTo(
 	            		"chartRoute", {
 	            			path:sPath.substr(1)
 	            		}
 	            ) 
            },
            
            _onFigure:function(oEvent){
            	 var sPath= this.getView().getBindingContext().getPath(); 
            	 this.getRouter().navTo(
 	            		"figureRoute", {
 	            			path:sPath.substr(1)
 	            		}
 	            ) 
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


