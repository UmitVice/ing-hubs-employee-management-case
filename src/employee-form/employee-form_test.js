import './employee-form.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('employee-form', () => {
  test('renders and validates required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    // should show some errors after invalid submit
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });
});


