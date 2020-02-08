import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render , resetOnerror , setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { UserValidator } from "../validations/user";
import { ConfigurationException } from 'ember-base-form-validation';

module('Integration | Component | validation-input-custom', function(hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(resetOnerror);

  test('it renders', async function(assert) {
    this.set('validation',new UserValidator());
    this.set('values',{
      username : "",
      email : ""
    });

    await render(hbs`
      <ValidationForm @schema={{this.validation}} as |form|>
        <ValidationInputCustom @value={{this.values.username}} @validation="username" @parent={{form}}>
          <input>
        </ValidationInputCustom>
        <ValidationInputCustom @value={{this.values.email}} @validation="email" @parent={{form}}>
          <input>
        </ValidationInputCustom>
      </ValidationForm>
    `);

    assert.strictEqual(this.element.querySelectorAll("input").length,2,"Form has 2 custom inputs");
  });

  test('should throw error when no validation schema provided', async function(assert) {
    this.set('values',{
      username : "",
      email : ""
    });

    let error = null;

    setupOnerror(function(err) {
      error = err;
    });

    await render(hbs`
      <ValidationForm as |form|>
        <ValidationInputCustom @value={{this.values.username}} @validation="username" @parent={{form}} />
        <ValidationInputCustom @value={{this.values.email}} @validation="email" @parent={{form}} />
      </ValidationForm>
    `);

    assert.strictEqual(error instanceof ConfigurationException,true,"Exception of type ConfigurationException");
  });

  test('should throw error when no parent provided', async function(assert) {
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('values',{
      username : "",
      email : ""
    });

    let error = null;

    setupOnerror((err) => {
      error = err;
    });

    // Template block usage:
    await render(hbs`
      <ValidationForm as |form|>
        <ValidationInputCustom @value={{this.values.username}} @validation="username" />
        <ValidationInputCustom @value={{this.values.email}} @validation="email" />
      </ValidationForm>
    `);

    assert.strictEqual(error instanceof ConfigurationException,true,"Exception of type ConfigurationException");
  });
});
