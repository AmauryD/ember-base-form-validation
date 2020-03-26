import validator from 'validator';
import { BaseValidator , ValidationProperty } from 'ember-base-form-validation';

function sleep(ms:number){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

export class UserValidator extends BaseValidator {
    @ValidationProperty()
    username(str: string) {
        if (!validator.isLength(str,{
            min : 10
        })) {
            return 'Lenght must be more than 10 characters';
        }
        return;
    }

    @ValidationProperty()
    async email(str: string) {
        sleep(Math.random());
        if (!validator.isEmail(str)) {
            return 'Email not valid';
        }
        return;
    }
}