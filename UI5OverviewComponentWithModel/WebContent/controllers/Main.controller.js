/**
 * Main controller component
 * 
 * @author		Christophe Taymans
 * @version		1.0.0
 * @since		1.0.0
 * @memberOf	ui5.overview.comp.model
 */

sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"        
    ],
    function (SAPMVCController,JSONModel) {
		        "use strict";
		
		        return SAPMVCController.extend("ui5.overview.comp.model.controllers.Main", {
		
		/**
		* Called when a controller is instantiated and its View controls (if available) are already created.
		* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		* @memberOf ui5overviewcomponent.Main
		*/
			onInit: function() {

// create a JSON structure with product list				
				var Products = { "Products" : [ 
						{  "Id" : "1" , "Description" :"product1", "Price" : 10, "Currency" : "EUR" },
						{  "Id" : "2" , "Description" :"product2", "Price" : 25.3, "Currency" : "EUR"   },
						{  "Id" : "3" , "Description" :"product3", "Price" : 2.4, "Currency" : "YEN"  },
						{  "Id" : "4" , "Description" :"product4", "Price" : 1000, "Currency" : "USD"   }
					] };		
// set model of view named "viewData" with product list		
				
				this.getView().setModel(new JSONModel(Products),"viewData");
			},
		
		      onSubmit: function(oEvent){
		    	  
		    	  // get value in input field
		    	  var key = oEvent.getSource().getSelectedKey();
		    	  
		    	  // get all products of the view model
		    	  var Products = this.getView().getModel("viewData").getProperty('/Products');	
		    	  
		    	  // get the selected product 
		    	  var selectedProduct = Products.find( function(product){ return product.Id == key } );
		    	  
		    	  // set the application model with the selected product
		    	  this.getView().getModel('appData').setProperty("/Product",selectedProduct );	

		        	
		     },
	
		});
    }
);