/**
 * @license
 * Copyright 2025
 */

import '../app-root.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('app-root', () => {
  function loadGlobalCSS() {
    return new Promise(resolve => {
      let link = document.querySelector('link[data-test-global-vars]');
      if (link) {
        resolve();
        return;
      }
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/styles/global-variables.css';
      link.setAttribute('data-test-global-vars', '');
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  suiteSetup(async () => {
    await loadGlobalCSS();
  });

  test('is defined', () => {
    const el = document.createElement('app-root');
    assert.instanceOf(el, customElements.get('app-root'));
  });

  test('renders homepage title', async () => {
    const el = await fixture(html`<app-root></app-root>`);
    const title = el.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.equal(title.textContent, 'ING Hub case study');
  });

  test('uses design tokens for host styles', async () => {
    const el = await fixture(html`<app-root></app-root>`);
    await el.updateComplete;
    const cs = getComputedStyle(el);
    assert.equal(cs.backgroundColor, 'rgb(249, 249, 249)');
  });

  test('title uses primary color token', async () => {
    const el = await fixture(html`<app-root></app-root>`);
    await el.updateComplete;
    const title = el.shadowRoot.querySelector('.title');
    const titleCs = getComputedStyle(title);
    // --color-primary: #FF6200 -> rgb(255, 98, 0)
    assert.equal(titleCs.color, 'rgb(255, 98, 0)');
  });
});


