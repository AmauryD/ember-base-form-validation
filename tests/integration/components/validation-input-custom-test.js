import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';


module('Integration | Component | validation-input-custom', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('validation',null);

    // Template block usage:
    await render(hbs`
      <ValidationForm as |form|>
        <ValidationInputCustom @parent={{form}} />
      </ValidationForm>
    `);

    console.log(this.element.textContent.trim())

    assert.equal(this.element.textContent.trim(),'');
  });
});
