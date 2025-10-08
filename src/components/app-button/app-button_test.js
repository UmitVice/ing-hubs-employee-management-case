import './app-button.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('app-button', () => {
  test('renders and dispatches click', async () => {
    const el = await fixture(html`<app-button>OK</app-button>`);
    let clicked = false;
    el.addEventListener('click', () => clicked = true);
    el.shadowRoot.querySelector('button').click();
    assert.isTrue(clicked);
  });

  test('supports variants', async () => {
    const el = await fixture(html`<app-button variant="secondary">Cancel</app-button>`);
    const btn = el.shadowRoot.querySelector('button');
    assert.isTrue(btn.classList.contains('secondary'));
  });
});


