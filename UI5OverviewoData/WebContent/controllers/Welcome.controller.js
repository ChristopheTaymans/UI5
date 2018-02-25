/**
 * Main controler component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.oData
 */


sap.ui.define(
    [   "ui5/overview/oData/controllers/BaseController",
    	"ui5/overview/oData/controllers/BasketHelper",
        "sap/ui/model/json/JSONModel" ,
        "sap/ui/model/Context"
    ],
    function (BaseController, BasketHelper, JSONModel, BindingCtx) {
        "use strict";

		
        return BaseController.extend("ui5.overview.oData.controllers.Welcome", {
            /**
             * 
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * 
			 */
        	
    		_iCarouselTimeout: 0, // a pointer to the current timeout
    		_iCarouselLoopTime : 5000, // loop to next picture after 4 seconds
    		_iFactor : 0,
    		
            onInit: function () {                  	
        	
		    },   

		    _selectCarouselItem : function(){
		    	
				var oWelcomeCarousel = this.byId("carouselId");
				if (oWelcomeCarousel) {					    
				var oPage = this.byId(oWelcomeCarousel.getActivePage());
				oWelcomeCarousel.next();
				this._bindCarouselPage(oPage);
			    };			    
			    		
		    },
		    
		    _bindCarouselPage(oPage){
		    	var randomIndex = Math.floor(Math.random() * this._iFactor);				
				oPage.bindElement({path : "/" + randomIndex, model : "Products"} );	
		    },
	    
		    onCarouselPageChanged: function(){
		    	clearTimeout(this._iCarouselTimeout);
		    	
				this._iCarouselTimeout = setTimeout( function(){
					this._selectCarouselItem();
					}.bind(this), this._iCarouselLoopTime);
		    },
		    
		    
		    _getProductId(){
		    	
		    	var oPage = this.byId(this.byId("carouselId").getActivePage());
		    	var sPath = oPage.getBindingContext('Products').getPath();		    	
		    	var productModel=this.getModel('Products');
		    	return productModel.getProperty(sPath).Productid;
		    },
		    
		    onSelectProduct: function(oEvent){	
		    	
		    	var productid =this._getProductId();
		    	var productPath = encodeURIComponent(this.getModel().createKey('/ProductsSet', { "Productid" : productid }));
		    	this.setInfo('backButton', true);		    			     
                this.getRouter().navTo(
               				"detailRoute",
               				{
               					path : productPath
               				}
            		)   
		    },
		    
			_onAddToCart: function() {
				
				BasketHelper.addToCart(this, this._getProductId());				
			},
		    
            /**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
             * 
			 */
            onBeforeRendering: function () {
            	
            	var oModel = this.getModel();
            	
            	oModel.read('/ProductsSet',{ 
					success:function(oData,respons){  
						if(oData.results.length){
							this._iFactor = oData.results.length;
							var products = oData.results.map(function(data){
								return { "Productid" : data.Productid ,
									     "Name" : data.Name,
									     "ProductPicUrl" : data.ProductPicUrl,
									     "Price" : data.Price,
									     "CurrencyCode" : data.CurrencyCode,
									     "Quantity" : data.Quantity
								       }	
							
							},this);
							this.getView().setModel(new JSONModel(products),"Products");	
							
							var oWelcomeCarousel = this.byId("carouselId");
							oWelcomeCarousel.getPages().forEach(this._bindCarouselPage,this);
														
						}	
					}.bind(this)	
            	});
            	
            	this.onCarouselPageChanged();
            },

            /**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
             * 
			 */
            onAfterRendering: function () { 
            	
            },

            /**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * 
			 */
            onExit: function () { }
        });
    }
);
