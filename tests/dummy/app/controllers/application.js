/* eslint-disable no-console */
import Controller from '@ember/controller';
import { UserValidator } from '../validations/user';
import { action } from '@ember/object';

export default class ApplicationController  extends Controller {
    validation;

    username = 'k';
    email = 'k@gmaiL.com';

    get model() {
        return {
            username : undefined,
            email : undefined
        };
    }

    constructor(...args) {
        super(...args);
        this.validation = new UserValidator(this);
    }
    
    @action
    submit(e) {
        e.preventDefault();

        this.validation.waitAndCheckErrors().then((hasErrors) => {
            if (hasErrors)
            {
                console.log("NOPE");
            }
            console.log(this.model);
        });
        //console.log("NOPE");
    }
}
