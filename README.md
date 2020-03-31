ember-base-form-validation
==============================================================================

![Test](https://github.com/TRIPTYK/ember-base-form-validation/workflows/Test/badge.svg)
![Build](https://github.com/TRIPTYK/ember-base-form-validation/workflows/Build/badge.svg)
[![npm version](https://badge.fury.io/js/ember-base-form-validation.svg)](https://badge.fury.io/js/ember-base-form-validation)

Simple ember component based form validation module , only providing base structure and components for validation . His goal is to be flexible and adaptive to any situation.

:warning: This addon does not provide any types validation methods or checks.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


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

Elements
------------------------------------------------------------------------------

### The validation form component

The validation form is the base of the validation , it must contain a `@schema` attribute in order to provide validation to the inputs.

*userform.hbs*
```html
<ValidationForm @validateOnInit={{false}} class="form" @schema={{this.validation}} as |form|>
</ValidationForm>
```

#### attributes
- `@schema` (required) : a `Validation schema` for the children inputs
- `@validateOnInit` (optional) : a `boolean` to tell the form to validate or not all the children on init.
- `any html attributes`(optional)

#### methods

- `validate`  : runs the validation for all the children

#### properties


- `isDirty` (`boolean`) : returns if the form is dirty (any field has been validated)
- `hasErrors` (`boolean`) : returns if the form validator has errors
- `validating` (`boolean`) : returns if the form validator is running validations (for async).

### The input component

The validation input is an HTML input who validates its value after some events had been triggered.

```html
<ValidationForm class="form" @schema={{this.validation}} as |form|>
  <ValidationInput @validation="username" @validateOn="change" name="username" @parent={{form}} as |i|>
    {{#if i.error}}
      <p>{{i.error}}</p>
    {{/if}}
  </ValidationInput>
  <ValidationInput @validation="email" @validateOn="focus" name="email" @parent={{form}} as |i|>
    {{#if i.error}}
      <p>{{i.error.message}} for {{i.error.field}}</p>
    {{/if}}
  </ValidationInput>
  <input type="submit" disabled={{form.hasErrors}} {{on "click" this.submit}} value="submit">
</ValidationForm>
```

#### attributes
- `@parent` (`BaseValidationFormComponent`) (required) : the parent form.
- `@validation` (`string`) (required) : Tell which validation the validator must use to validate the input value.
- `@validateOn` (`string`) (optional) : an html event to tell the input when to launch its validation.
- `@alone` (`boolean`) (optional) : disable the validation , `@parent` and `@validation` attributes become optional.
- `any html attributes`(optional)

#### methods

- `validate`  : runs the validation for the input

#### properties

- `isDirty` (`boolean`) : returns if the input value is dirty (has been validated)
- `error` (`any`) : error associated to the input (`null` if no error)

### The validation schema

The validation schema checks if the current value of the input is correct , otherwhise it returns any value indicating there's an error for the field.
If it returns `null` or `undefined` , the value is correct.
The method can be async or sync.

```js
import validator from 'validator'; // external validation module
import { BaseValidator , validationProperty } from 'ember-base-form-validation';

export class UserValidator extends BaseValidator {
    @validationProperty()
    username(str) {
        if (!validator.isLength(str,{
            min : 10
        })) {
            return 'Lenght must be less than 10 characters';
        }
    }

    @validationProperty()
    async email(str) {
        if (!validator.isEmail(str)) {
            return { // can return in any format you want
              message : 'Email not valid',
              field : 'email'
            };
        }
    }
}
```

#### The validation property

`@validationProperty(ignoreUndefined = true)` indicates that the method is a validation method. The parameter `ignoreUndefined` converts the input value to a null string if it's undefined.

### properties

- `errors` `object` : errors of the validator
- `context` `any` : context passed by the constructor


### methods

- `waitAndCheckErrors` (`Promise<boolean>`) : wait for the validator to finish validation and returns if it contains errors.

- `hasErrors` (`boolean`) : returns if validator has errors

- `isDirty` (`boolean`) : returns if validator has validated this field at least once

- `validationRunning` (`boolean`) : returns if validator is running async tasks.

### Registeting and checking the validation controller side 

```js
import Component from '@glimmer/component';
import { UserValidator } from '../validation/user';
import { action } from '@ember/object';

export default class UserFormComponent extends Component {
    validation;

    constructor(...args) {
        super(...args);
        this.validation = new UserValidator(this);
    }
    
    @action
    submit(t) {
        this.validation.waitAndCheckErrors().then(  (hasErrors) => {
          if (hasErrors) {
            return;
          }
          // do your job
        }
    }
}
```



### Custom validation input :

Same as above except for the template.
Custom Input let you define you own input to bind the value to and validate.

*userform.hbs*
```handlebars
<ValidationForm @validateOnInit={{true}} @schema={{this.validation}} as |form|>
  <ValidationInputCustom @parent={{form}} @validation="username" @value={{@model.username}} as |i|>
    <Input type="text" name="username" @value={{i.value}} {{on "change" i.validate}}  />

    {{#if i.error}}
      <p>{{i.error}}</p>
    {{/if}}
  </ValidationInputCustom>

    <ValidationInputCustom @parent={{form}} @validation="email" @value={{@model.email}} as |i|>
    <Input type="text" name="email" @value={{i.value}} {{on "change" i.validate}}  />

    {{#if i.error}}
      <p>{{i.error}}</p>
    {{/if}}
  </ValidationInputCustom>
  
  {{#if form.validating}}
    <p>Validating...</p>
  {{else}}
    <input type="submit" disabled={{form.hasErrors}} {{on "click" this.submit}} value="submit">
  {{/if}}
</ValidationForm>
```

### Create your own components

You can inherit `BaseValidationInputComponent` class to make your custom input component and `BaseValidationFormComponent` to make your own validation form

*myinput.js*
```js
import { action } from '@ember/object';
import { BaseValidationInputComponent } from 'ember-base-form-validation';

export default class MyinputComponent extends BaseValidationInputComponent {
    constructor() {
        super(...arguments);
        console.log("Init custom");
    }

    @action
    validate() {  
        super.validate();
        console.log("Validate " + this.name);
    }
}

```

*myform.js*
```js
import { action } from '@ember/object';
import { BaseValidationFormComponent } from 'ember-base-form-validation';

export default class MyformComponent extends BaseValidationFormComponent {
    constructor() {
        super(...arguments);
        console.log("Init custom");
    }

    @action
    validate() {  
        super.validate();
        console.log("Validate all");
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
