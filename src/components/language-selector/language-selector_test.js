import './language-selector.js';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('language-selector', () => {
  test('is defined and shows a flag', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    assert.instanceOf(el, customElements.get('language-selector'));
    const img = el.shadowRoot.querySelector('img.flag-icon');
    assert.exists(img);
  });

  test('dispatches language-changed when clicked', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('button');
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, 'language-changed');
    assert.ok(ev.detail.locale === 'tr' || ev.detail.locale === 'en');
  });
});


