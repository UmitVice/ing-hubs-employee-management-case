import './app-navbar.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('app-navbar', () => {
  test('is defined and renders', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    assert.instanceOf(el, customElements.get('app-navbar'));
    const nav = el.shadowRoot.querySelector('.navbar');
    assert.exists(nav);
  });

  test('has navigation buttons', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    const employeesBtn = el.shadowRoot.querySelector('.link');
    const addBtn = el.shadowRoot.querySelector('.text-button');
    assert.exists(employeesBtn);
    assert.exists(addBtn);
  });

  test('language selector exists', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    const lang = el.shadowRoot.querySelector('language-selector');
    assert.exists(lang);
  });
});


