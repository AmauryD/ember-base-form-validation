import BaseValidationInputComponent from '../validations/base-validation-input';
import { inject as service } from "@ember/service";

export default class ValidationInputComponent extends BaseValidationInputComponent {
    @service test;
    nbr = 0;
    
    constructor() {
        super(...arguments);
        console.log(this);
        console.log(this.test)
    }

    
}
