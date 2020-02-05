import validator from 'validator';
import { BaseValidator , validationProperty } from 'ember-base-form-validation';

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

export class UserValidator extends BaseValidator {
    @validationProperty
    username(str) {
        if (!validator.isLength(str,{
            min : 10
        })) {
            return 'Lenght must be less than 10 characters';
        }
    }

    @validationProperty
    async email(str) {
        if (!validator.isEmail(str)) {
            return 'Email not valid';
        }
    }
}