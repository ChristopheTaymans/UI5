/*global history */
sap.ui.define([
		"ui5/overview/oData/controllers/BaseController",
		"sap/ui/model/Context",
		'sap/m/MessageToast'
	],	function(BaseController, ContextBinding, MessageToast){
		"use strict";
        
        return {
        		
          addToCart: function (view, productId) {
        					var oDataModel = view.getModel();		
			                view.setBusy(true);
			/// sent a create request                
			                oDataModel.create('/BasketItemSet', {
								'Productid': productId,
								'Quantity': -1
							}, {
								success: function(oData, response) {
									view.setBusy(false);
									oDataModel.refresh(true);
									MessageToast.show(view.getText("SAVED"), {
										closeOnBrowserNavigation: false
									});
								}.bind(this),
								error: function(oError) {
									view.setBusy(false);
									var errorTxt = JSON.parse(oError.responseText).error.message.value;
									MessageToast.show(errorTxt, {
										closeOnBrowserNavigation: false
									});
								}.bind(this)
							});
			                
			/// the following is another way by creating through batches ( UseBatch must be tru in the manifest in the model)   
			/// issue : i can't catch error from the FM...the batch request is succesfull even if error occur in the FM            

							//            	var oNewEntry = oDataModel.createEntry('/BasketItemSet');
							//            	var oDetailBindingCtx = new ContextBinding(oDataModel, oNewEntry.getPath());      	
							//            	oNewEntry.getModel().setProperty('Productid', Productid, oDetailBindingCtx  );
							//            	oNewEntry.getModel().setProperty('Quantity', -1 , oDetailBindingCtx   );		

							//            	oDataModel.submitChanges({                		
							//             		success: function(oData,response){ 
							//             			this.setBusy(false);   
							//             			oDataModel.refresh(true);            			 
							//             			MessageToast.show(this.getText("SAVED"),{closeOnBrowserNavigation:false });             		  
							//                  	}.bind(this),                 	
							//             		error: function(oError){     
							//             			this.setBusy(false);             			 
							//             			var errorTxt = JSON.parse(oError.responseText).error.message.value;  
							//             			MessageToast.show(errorTxt,{closeOnBrowserNavigation:false });              			
							//             		}.bind(this)
							//             	 }); 							
						}
    	};  
    }
);