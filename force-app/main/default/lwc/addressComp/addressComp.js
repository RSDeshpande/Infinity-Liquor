import { LightningElement, api } from 'lwc';

export default class AddressComp extends LightningElement {
    @api address;

    handleSelect(){
        const newEvt = new CustomEvent(
            'address',
        {
            detail : this.address.Id
        });
        this.dispatchEvent(newEvt);
    }
    

}