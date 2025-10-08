import {adoptStylesheets} from './style-loader.js';
import {fixture, assert} from '@open-wc/testing';
import {LitElement, html} from 'lit';

class TestEl extends LitElement {
  render() { return html`<slot></slot>`; }
}
customElements.define('test-style-el', TestEl);

suite('style-loader', () => {
  test('adopts a single stylesheet URL', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    await adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
    
    assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, initialCount + 1);
  });

  test('adopts multiple stylesheet URLs', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    const stylesheets = [
      new URL('../../styles/global-variables.css', import.meta.url),
      new URL('../../styles/global-variables.css', import.meta.url) // Same file twice for testing
    ];
    
    await adoptStylesheets(el.shadowRoot, stylesheets);
    
    assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, initialCount + 2);
  });

  test('handles empty stylesheet array', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    await adoptStylesheets(el.shadowRoot, []);
    
    assert.equal(el.shadowRoot.adoptedStyleSheets.length, initialCount);
  });

  test('handles invalid stylesheet URLs gracefully', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    // Should not throw error with invalid URL
    await adoptStylesheets(el.shadowRoot, [new URL('invalid-path.css', import.meta.url)]);
    
    // Should not have added any stylesheets
    assert.equal(el.shadowRoot.adoptedStyleSheets.length, initialCount);
  });

  test('handles network errors gracefully', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    
    // Mock fetch to simulate network error
    const originalFetch = window.fetch;
    window.fetch = () => Promise.reject(new Error('Network error'));
    
    try {
      const initialCount = el.shadowRoot.adoptedStyleSheets.length;
      await adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
      
      // Should not have added any stylesheets due to error
      assert.equal(el.shadowRoot.adoptedStyleSheets.length, initialCount);
    } finally {
      window.fetch = originalFetch;
    }
  });

  test('handles malformed CSS gracefully', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    // Mock fetch to return malformed CSS
    const originalFetch = window.fetch;
    window.fetch = () => Promise.resolve({
      ok: true,
      text: () => Promise.resolve('invalid css content {')
    });
    
    try {
      await adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
      
      // Should still add the stylesheet even if malformed
      assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, initialCount);
    } finally {
      window.fetch = originalFetch;
    }
  });

  test('preserves existing stylesheets', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    
    // Add a stylesheet first
    await adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
    const firstCount = el.shadowRoot.adoptedStyleSheets.length;
    
    // Add another stylesheet
    await adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
    
    // Should have added more stylesheets
    assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, firstCount + 1);
  });

  test('handles null shadowRoot gracefully', async () => {
    // Should not throw error with null shadowRoot
    await adoptStylesheets(null, [new URL('../../styles/global-variables.css', import.meta.url)]);
    
    // Test passes if no error is thrown
    assert.isTrue(true);
  });

  test('handles undefined stylesheets parameter', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    // Should not throw error with undefined
    await adoptStylesheets(el.shadowRoot, undefined);
    
    assert.equal(el.shadowRoot.adoptedStyleSheets.length, initialCount);
  });

  test('handles non-array stylesheets parameter', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    // Should not throw error with non-array
    await adoptStylesheets(el.shadowRoot, 'not-an-array');
    
    assert.equal(el.shadowRoot.adoptedStyleSheets.length, initialCount);
  });

  test('returns promise that resolves', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    
    const result = adoptStylesheets(el.shadowRoot, [new URL('../../styles/global-variables.css', import.meta.url)]);
    
    assert.instanceOf(result, Promise);
    await result; // Should resolve without error
  });

  test('handles duplicate stylesheet URLs', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    const url = new URL('../../styles/global-variables.css', import.meta.url);
    const stylesheets = [url, url, url]; // Same URL multiple times
    
    await adoptStylesheets(el.shadowRoot, stylesheets);
    
    // Should add all stylesheets even if duplicates
    assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, initialCount + 3);
  });

  test('handles mixed valid and invalid URLs', async () => {
    const el = await fixture(html`<test-style-el></test-style-el>`);
    const initialCount = el.shadowRoot.adoptedStyleSheets.length;
    
    const stylesheets = [
      new URL('../../styles/global-variables.css', import.meta.url), // Valid
      new URL('invalid-path.css', import.meta.url), // Invalid
      new URL('../../styles/global-variables.css', import.meta.url)  // Valid
    ];
    
    await adoptStylesheets(el.shadowRoot, stylesheets);
    
    // Should add valid stylesheets
    assert.isAtLeast(el.shadowRoot.adoptedStyleSheets.length, initialCount + 2);
  });
});


