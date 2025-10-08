import './app-search.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('app-search', () => {
  test('emits value-changed on input', async () => {
    const el = await fixture(html`<app-search placeholder="Search"></app-search>`);
    const input = el.shadowRoot.querySelector('input');
    let last;
    el.addEventListener('value-changed', (e) => last = e.detail.value);
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    assert.equal(last, 'abc');
  });
});


