import { LightningElement, wire, track } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCartId from '@salesforce/apex/BeerController.getCartId';
import createCartItems from '@salesforce/apex/BeerController.createCartItems';
export default class BeerList extends LightningElement {

     beerRecords;
     errros;
     cartId;

    connectedCallback(){
        this.defaultCartId();
    }

    defaultCartId(){
        getCartId()
        .then(data=>{
            console.log('Cart Id '+data);
            this.cartId = data;
        })
        .catch(error=>{
            console.error(error);
        })
    }

    @wire(searchBeer)
        wiredRecords({error, data}){
            console.log(' Data ', data);
            this.beerRecords = data;
            this.errors = error;
        }

    handleAddToCart(event){
        const selectBeerId = event.detail;
        console.log(selectBeerId);
        const selectBeerRecord = this.beerRecords.find(
            record => record.Id === selectBeerId
        );
        createCartItems({
            CartId : this.cartId,
            BeerId : selectBeerId,
            Amount : selectBeerRecord.Price__c
        })
        .then(data => {
            console.log(' Cart Item Id ', data);
            
        })
        .catch(error => {
            console.log(error);
        });

        const toastEvt = new ShowToastEvent({
            title: 'Item '+selectBeerRecord.Name+' added to cart',
            variant: 'success'
        });
        this.dispatchEvent(toastEvt);
    }


    //get all the beer records based on search value
    handleEvent(event){
        const eventVal = event.detail;
        console.log( 'Search param '+eventVal); 
        searchBeer({ searchParam:eventVal}) //searchParam :
        .then(result => {
            console.log(' Beer Records ', result);
            this.beerRecords = result;
            this.errros = undefined;
        })
        .catch(error => {
            console.log(' Errors ', error);
            this.errors = error;
            this.beerRecords = undefined;
        })
    }
}