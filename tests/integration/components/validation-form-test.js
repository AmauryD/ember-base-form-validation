import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | validation-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Template block usage:
    await render(hbs`
      <ValidationForm>
      </ValidationForm>
    `);

    assert.notStrictEqual(this.element.querySelector("form"),null,"Should have a <form>");
  });

  test('should pass attributes', async function(assert) {
    await render(hbs`
      <ValidationForm class="hotpotato">
      </ValidationForm>
    `)

    assert.strictEqual(this.element.querySelector("form").hasAttribute("class"),true,"form has class");
    assert.strictEqual(this.element.querySelector("form").getAttribute("class").valueOf().includes("hotpotato"),true,"form has hotpotato class");
  });
});
