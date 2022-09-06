import { LightningElement, api } from 'lwc';

export default class CartItem extends LightningElement {

    @api item;

    handleDelete(){
        const deleteEvt = new CustomEvent(
            'delete',
            {
                detail: this.item.Id
            }
        );
        this.dispatchEvent(deleteEvt);
    }
}