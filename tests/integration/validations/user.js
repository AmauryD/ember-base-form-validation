import validator from 'validator';
import { BaseValidator , ValidationProperty } from "ember-base-form-validation";

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

export class UserValidator extends BaseValidator {
    @ValidationProperty()
    username(str) {
        if (!validator.isLength(str,{
            min : 10
        })) {
            return 'Lenght must be more than 10 characters';
        }
    }

    @ValidationProperty()
    async email(str) {
        sleep(Math.random(1000));
        if (!validator.isEmail(str)) {
            return 'Email not valid';
        }
    }
}