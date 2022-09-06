import getCartId from '@salesforce/apex/BeerController.getCartId';
import getAllAddresses from '@salesforce/apex/CartController.getAllAddresses';
import getAllCartItems from '@salesforce/apex/CartController.getAllCartItems';
import getCart from '@salesforce/apex/CartController.getCart';
import placeOrder from '@salesforce/apex/CartController.placeOrder';
import saveNewAddress from '@salesforce/apex/CartController.saveNewAddress';
import {NavigationMixin} from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';



import { LightningElement, track } from 'lwc';

export default class CartDetailComp extends NavigationMixin(LightningElement) {
    showCart =true;
    addressID;
    selectedAddress;
    cartId;
    cart;
    error;
    cartItems;
    totalAmount = 0.00;
    addresses;
    totalAddress;
    addrr = {
        City__c :'',
        Street__c: '',
        State__c:'',
        Country__c:'',
        Postal_Code__c:''
    };

    connectedCallback(){
        this.getDefaultCartId();
        this.getAdressDetails();
    }

    getDefaultCartId(){

        getCartId()
        .then(result=>{
            this.cartId = result;
            console.log(result);
            this.getDefaultCart();
            this.getCartItems();
            this.error = undefined;
        })
        .catch(error=>{
            this.error = error;
            this.cartId = undefined;
        });
        
    
    }

    getCartItems(){
        getAllCartItems({CartId: this.cartId})
        .then(result=>{
            this.cartItems = JSON.parse(result);
            for (let i = 0; i < this.cartItems.length; i++) {
                if(this.cartItems[i])
                this.totalAmount = this.totalAmount + this.cartItems[i].Item_Amount__c ;
                
            }
            console.log(this.cartItems[0].Beer__r.Name+" "+ this.totalAmount);
        })
        .catch(eror=>{
            console.error(error);
        })
        
    }

    getDefaultCart(){
    getCart({CartId: this.cartId})
    .then(result=>{
        this.cart = result;
        console.log(this.cart);
    })
    .catch(error=>{
        console.log(error);
    });
    }

    getAdressDetails(){

        getAllAddresses()
        .then(result=>{
            console.log(result);
            this.addresses = result;
            this.totalAddress = result.length;
        })
        .catch(error=>{
            console.log(error);
        });
    }


    handleContinue(){
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Beer_Project' 
            }
        });

        
    }

    handleItemDelete(event){
            const selectedItem = event.detail;
            console.log(this.cartItems.length);
            const selectedRec = this.cartItems.find(
                cartItem => cartItem.Id === selectedItem
                );
            const indexItem = this.cartItems.indexOf(selectedRec);
            console.log(this.totalAmount);
            
            deleteRecord(selectedItem)
            .then(()=>{
                this.cartItems.splice(indexItem,1);
                this.totalAmount = this.totalAmount - selectedRec.Item_Amount__c;
                console.log('Record Deleted!!');
                
                
            })
            .catch(()=>{
                console.log('Error');
            });   
    }

    handleProceed(){
        this.showCart = false;
       
    }

    handleAddNewAddress(){
        this.totalAddress = 0;
    }

    handleInputChange(event){
        const key = event.target.name;
        const val = event.target.value;

      this.addrr[key]= val;
    }

    handleSaveNewAddress(event){
        saveNewAddress({
            newAddress : JSON.stringify(this.addrr)
        })
        .then(result=>{
            console.log('New Address Added Successfully', result);
            this.addresses.push(result);
            this.totalAddress = 1;
        })
        .catch(error=>{
            console.log('error');
        })
        
    }

    handleDelivery(event){
         const selectedAddID = event.detail;
         this.addressID = selectedAddID;
        
         this.selectedAddress = this.addresses.find(
             addRecord=> addRecord.Id === this.addressID
         );
    }

    handlePlaceOrder(){
        placeOrder({
            cartId : this.cartId,
            AddressId : this.addressID
        })
        .then(result=>{
            console.log(result);
            const newEvt = new ShowToastEvent({
                title: 'Order Placed Successfully',
                variant: 'Success'
            });
            this.dispatchEvent(newEvt);

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    actionName: "view",
                    recordId: result.Id,
                    objectApiName: "Order__c"
                }
            });
        })
        .catch(error=>{
            console.log(error);
        });
    }
}