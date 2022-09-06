import { LightningElement,track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class BeerSearch extends NavigationMixin(LightningElement) {

    @track searchValue;

    handleChange(event){
        const value = event.target.value;

        const searchEvt = new CustomEvent('search',
        {
            detail: value
        }
        );
        this.dispatchEvent(searchEvt);
    }

    handleShowCart(){
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: "Cart_Details"
            }
        });
    }


}