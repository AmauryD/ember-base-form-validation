ember-base-validation
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
ember install ember-simple-validation
```


Usage
------------------------------------------------------------------------------

Example
------------------------------------------------------------------------------

Simple validation form :


userform.hbs
```handlebars
<ValidationForm @schema={{this.validation}} as |form|>
  <ValidationInput @parent={{form}} @name="username" @value={{@model.username}} as |i|>
    <Input type="text" name="username" @value={{i.value}}  />

    {{#if i.error}}
      <p>{{i.error.message}}</p>
    {{/if}}
  </ValidationInput>

  <ValidationInput @parent={{form}} @name="email" @value={{@model.username}} as |i|>
    <Input type="text" name="email" @value={{i.value}}   />

    {{#if i.error}}
      <p>{{i.error.message}}</p>
    {{/if}}
  </ValidationInput>
  
  <input type="submit" {{on "click" form.validateAll}} {{on "click" this.submit}} value="submit">
</ValidationForm>
```

userform.js
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
        if (this.validation.hasErrors())
        {
            // if has errors , deny
            return;
        }
    }
}
```

In this example we use validator as validation library but you can use any library you want

user.js
```js
import validator from 'validator';
import { BaseValidator , validationProperty } from 'ember-simple-validation';


export class UserValidator extends BaseValidator {
    @validationProperty
    username(str) {
        return this.validationObject(
            validator.isLength(str,{
                min : 10
            }),
            'Lenght must be less than 10 characters'
        );
    }

    @validationProperty
    email(str) {
        return this.validationObject(
            validator.isEmail(str),
            'Email not valid'
        );
    }
}
```



Contributing
------------------------------------------------------------------------------

:exclamation: New to EmberJS community don't hesitate to contribute and correct me on bad practices
See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
