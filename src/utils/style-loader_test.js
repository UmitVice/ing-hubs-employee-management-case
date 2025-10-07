import {adoptStylesheets} from './style-loader.js';
import {fixture, assert} from '@open-wc/testing';
import {LitElement, html} from 'lit';

class TestEl extends LitElement {
  render() { return html`<slot></slot>`; }
}
customElements.define('test-style-el', TestEl);

suite('style-loader', () => {
  test('adopts a stylesheet URL', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    await adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
    assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, 1);
  });
});


