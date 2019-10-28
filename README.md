ember-base-form-validation
==============================================================================

Simple ember component based form validation module , only providing base structure and components for validation 
:warning: This addon does not provide any types validation methods or checks


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-base-form-validation
```


Features
------------------------------------------------------------------------------

- Async validation
- Component level validation
- You choose when to validate and at which level
- You can use 2 components : 
  - ValidationForm : form who contains ValidationInput and ValidationInputCustom components
    - methods : validate 
    - properties : validating , hasErrors
  - ValidationInput 
    - methods : validate
    - properties : error
  - ValidationInputCustom : you need to bind the value yourself , you juste have the method validate available

Usage
------------------------------------------------------------------------------

Simple validation form :


*userform.hbs*
```handlebars
<ValidationForm @schema={{this.validation}} as |form|>
  <ValidationInput @parent={{form}} @validation="username"  @validateOn="change" @value={{@model.username}} as |i|>
    {{#if i.error}}
      <p>{{i.error}}</p>
    {{/if}}
  </ValidationInput>

  <ValidationInput @parent={{form}} @validation="email" @validateOn="change" @value={{@model.username}} as |i|>
    {{#if i.error}}
      <p>{{i.error}}</p>
    {{/if}}
  </ValidationInput>
  
  {{#if form.validating}}
    <p>Validating...</p>
  {{else}}
    <input type="submit" disabled={{form.hasErrors}} {{on "click" form.validate}} {{on "click" this.submit}} value="submit">
  {{/if}}
</ValidationForm>
```

*userform.js*
```js
import Component from '@glimmer/component';
import { UserValidator } from '../validation/user';
import { action } from '@ember/object';

export default class UserFormComponent extends Component {
    validation;

    constructor(...args) {
        super(...args);
        this.validation = new UserValidator();
    }
    
    @action
    submit(t) {
        if (this.validation.hasErrors() || this.validation.validationRunning())
        {
            // if has errors or async tasks are running , deny
            return;
        }

        // do your job
    }
}
```

In this example we use validator as validation library but you can use any library you want
Validation methods can also be async 

*user.js*
```js
import validator from 'validator';
import { BaseValidator , validationProperty } from 'ember-simple-validation';

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
```



Contributing
------------------------------------------------------------------------------

:exclamation: I'm new to EmberJS community , don't hesitate to contribute !
See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
