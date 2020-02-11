import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render , resetOnerror , setupOnerror , fillIn , click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { UserValidator } from "../validations/user";
import { ConfigurationException } from "ember-base-form-validation";

module('Integration | Component | validation-input', function(hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(resetOnerror);

  test('it renders', async function(assert) {
    this.set('validation',new UserValidator());
    this.set('values',{
      username : "",
      email : ""
    });

    // Template block usage:
    await render(hbs`
      <ValidationForm @schema={{this.validation}} as |form|>
        <ValidationInput @value={{this.values.username}} @validation="username" @parent={{form}} />
        <ValidationInput @value={{this.values.email}} @validation="email" @parent={{form}} />
      </ValidationForm>
    `);

    assert.strictEqual(this.element.querySelectorAll("input").length,2,"Form has 2 inputs");
  });

  test('should throw error when no validation schema provided', async function(assert) {
    this.set('values',{
      username : "",
      email : ""
    });

    setupOnerror(function(err) {
      assert.strictEqual(err instanceof ConfigurationException,true,"Exception of type ConfigurationException");
    });

    // Template block usage:
    await render(hbs`
      <ValidationForm as |form|>
        <ValidationInput @value={{this.values.username}} @validation="username" @parent={{form}} />
        <ValidationInput @value={{this.values.email}} @validation="email" @parent={{form}} />
      </ValidationForm>
    `);
  });

  test('should throw error when no parent provided', async function(assert) {
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('values',{
      username : "",
      email : ""
    });

    this.set('validation',new UserValidator());

    let error = null;

    setupOnerror((err) => {
      error = err;
    });

    // Template block usage:
    await render(hbs`
      <ValidationForm @schema={{this.validation}}>
        <ValidationInput @value={{this.values.username}} @validation="username" />
        <ValidationInput @value={{this.values.email}} @validation="email" />
      </ValidationForm>
    `);

    assert.strictEqual(error instanceof ConfigurationException,true,"Exception of type ConfigurationException");
  });

  test('should pass attributes', async function(assert) {
    // Template block usage:
    this.set('validation',new UserValidator());

    await render(hbs`
      <ValidationForm @schema={{this.validation}} as |form|>
        <ValidationInput class="hotpotato" @value={{this.values.username}} @validation="username" @parent={{form}} />
      </ValidationForm>
    `)


    assert.strictEqual(this.element.querySelector("input").hasAttribute("class"),true);
    assert.strictEqual(this.element.querySelector("input").getAttribute("class").valueOf().includes("hotpotato"),true);
  });

  test('validation on click', async function(assert) {
    this.set('validation',new UserValidator());
    const values = {
      username : ""
    };

    this.set('values',values);
    this.set('preventSubmit',(e) => {
      e.preventDefault();
    });

    await render(hbs`
      <ValidationForm @schema={{this.validation}} {{on "submit" this.preventSubmit}} as |form|>
        <ValidationInput id="username" @value={{this.values.username}} @validation="username" @parent={{form}} as |e|>
          {{#if e.error}}
            <p class="error">error</p>
          {{/if}}
        </ValidationInput>
        <button {{on "click" form.validate}}></button>
      </ValidationForm>
    `);
    
    assert.strictEqual(this.element.querySelector("#username").value,"","Value is empty");

    await click('button');

    assert.strictEqual(this.element.querySelector("p.error").textContent,"error","Field contains errors after validate");
  });

  test('validation for undirty form', async function(assert) {
    this.set('validation',new UserValidator());
    const values = {
      username : ""
    };

    this.set('values',values);
    this.set('preventSubmit',(e) => {
      e.preventDefault();
    });

    await render(hbs`
      <ValidationForm @schema={{this.validation}} {{on "submit" this.preventSubmit}} as |form|>
        <ValidationInput id="username" @validateOn="change" @value={{this.values.username}} @validation="username" @parent={{form}} as |e|>
          {{#if e.error}}
            <p class="error">error</p>
          {{/if}}
        </ValidationInput>
        <button {{on "click" form.validate}} disabled={{if form.isDirty false true}}></button>
      </ValidationForm>
    `);
    
    assert.strictEqual(this.element.querySelector("button").disabled,true,"Field is disabled before validate");

    await fillIn('#username',"test");

    assert.strictEqual(this.element.querySelector("button").disabled,false,"Field is enabled validate");
  });

  test('validation on click disable', async function(assert) {
    this.set('validation',new UserValidator());
    const values = {
      username : ""
    };

    this.set('values',values);
    this.set('preventSubmit',(e) => {
      e.preventDefault();
    });

    await render(hbs`
      <ValidationForm @schema={{this.validation}} {{on "submit" this.preventSubmit}} as |form|>
        <ValidationInput id="username" @value={{this.values.username}} @validation="username" @parent={{form}}/>
        <button disabled={{if form.hasErrors "true" "false"}} {{on "click" form.validate}}></button>
      </ValidationForm>
    `);

    assert.strictEqual(this.element.querySelector("#username").value,"","Value is empty");
    assert.strictEqual(this.element.querySelector("button").disabled,true,"Field is enabled before validate");

    await click('button');

    assert.strictEqual(this.element.querySelector("button").disabled,true,"Field is disabled after validate");
  });
});
