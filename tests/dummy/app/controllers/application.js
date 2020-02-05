import Controller from '@ember/controller';
import { UserValidator } from '../validations/user';
import { action } from '@ember/object';

export default class ApplicationController  extends Controller {
    validation;

    get model() {
        return {
            username : 'test',
            email : 'test@email.com'
        };
    }

    constructor(...args) {
        super(...args);
        this.validation = new UserValidator();
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
