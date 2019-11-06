import validator from 'validator';
import { BaseValidator , validationProperty } from 'ember-base-form-validation';

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
    email(str) {
        if (!validator.isEmail(str)) {
            return 'Email not valid';
        }
    }
}