import { LightningElement, api } from 'lwc';

export default class BeerTile extends LightningElement {
    @api beerRecord;

    handleAddToCart(event){

        const cartEvt =new CustomEvent('addtocart',
        {
            detail: this.beerRecord.Id
        }
        );

        this.dispatchEvent(cartEvt);
    }
}