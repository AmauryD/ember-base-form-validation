import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { UserValidator } from "../validations/user";

module('Integration | Component | validation-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('validation',new UserValidator());
    // Template block usage:
    await render(hbs`
      <ValidationForm as |form|>
        <ValidationInput @parent={{form}} />
      </ValidationForm>
    `);

    assert.equal(this.element.textContent.trim(),'');
  });
});
