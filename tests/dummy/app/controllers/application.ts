/* eslint-disable no-console */
import Controller from '@ember/controller';
import { UserValidator } from '../validations/user';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
    private validation : UserValidator;

    username = 'k';
    email = 'k@gmaiL.com';

    get model() {
        return {
            username : undefined,
            email : undefined
        };
    }

    constructor(properties : object) {
        super(properties);
        this.validation = new UserValidator(this);
    }
    
    @action
    submit(e : Event) {
        e.preventDefault();

        this.validation.waitAndCheckErrors().then((hasErrors : boolean) => {
            if (hasErrors)
            {
                alert('not pass');
                return;
            }
            alert('pass');
        });
    }
}
