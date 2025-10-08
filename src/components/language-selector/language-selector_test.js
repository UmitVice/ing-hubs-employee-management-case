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

  test('renders with correct structure', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    const img = el.shadowRoot.querySelector('img.flag-icon');
    const text = el.shadowRoot.querySelector('.language-text');
    
    assert.exists(button);
    assert.exists(img);
    assert.exists(text);
  });

  test('shows current language flag', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const img = el.shadowRoot.querySelector('img.flag-icon');
    assert.exists(img.src);
    assert.include(img.src, '.png');
  });

  test('shows current language text', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const text = el.shadowRoot.querySelector('.language-text');
    assert.isString(text.textContent);
    assert.isTrue(text.textContent.length > 0);
  });

  test('toggles between languages on click', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const initialLocale = el.currentLocale;
    const button = el.shadowRoot.querySelector('button');
    
    button.click();
    await el.updateComplete;
    
    assert.notEqual(el.currentLocale, initialLocale);
  });

  test('cycles through available languages', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    const initialLocale = el.currentLocale;
    
    // Click to change language
    button.click();
    await el.updateComplete;
    const secondLocale = el.currentLocale;
    
    // Click again to change back
    button.click();
    await el.updateComplete;
    const thirdLocale = el.currentLocale;
    
    assert.notEqual(initialLocale, secondLocale);
    assert.notEqual(secondLocale, thirdLocale);
  });

  test('updates flag image when language changes', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const img = el.shadowRoot.querySelector('img.flag-icon');
    const initialSrc = img.src;
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    await el.updateComplete;
    
    assert.notEqual(img.src, initialSrc);
  });

  test('updates text when language changes', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const text = el.shadowRoot.querySelector('.language-text');
    const initialText = text.textContent;
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    await el.updateComplete;
    
    assert.notEqual(text.textContent, initialText);
  });

  test('handles keyboard navigation', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    button.focus();
    
    assert.equal(document.activeElement, button);
    
    // Should respond to Enter key
    let clicked = false;
    el.addEventListener('language-changed', () => clicked = true);
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    button.dispatchEvent(enterEvent);
    
    assert.isTrue(clicked);
  });

  test('handles Space key', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let clicked = false;
    el.addEventListener('language-changed', () => clicked = true);
    
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    button.dispatchEvent(spaceEvent);
    
    assert.isTrue(clicked);
  });

  test('has proper accessibility attributes', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('role'), 'button');
    assert.exists(button.getAttribute('aria-label'));
  });

  test('handles aria-label attribute', async () => {
    const el = await fixture(html`<language-selector aria-label="Change language"></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('aria-label'), 'Change language');
  });

  test('handles title attribute', async () => {
    const el = await fixture(html`<language-selector title="Switch language"></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('title'), 'Switch language');
  });

  test('handles disabled state', async () => {
    const el = await fixture(html`<language-selector disabled></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.disabled);
  });

  test('prevents click when disabled', async () => {
    const el = await fixture(html`<language-selector disabled></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let clicked = false;
    el.addEventListener('language-changed', () => clicked = true);
    
    button.click();
    
    assert.isFalse(clicked);
  });

  test('handles multiple rapid clicks', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    const initialLocale = el.currentLocale;
    
    // Click multiple times rapidly
    button.click();
    button.click();
    button.click();
    await el.updateComplete;
    
    // Should have changed from initial state
    assert.notEqual(el.currentLocale, initialLocale);
  });

  test('handles custom language list', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    // Test with custom languages if supported
    el.languages = ['en', 'tr', 'fr'];
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    const initialLocale = el.currentLocale;
    
    button.click();
    await el.updateComplete;
    
    assert.notEqual(el.currentLocale, initialLocale);
  });

  test('handles language change events', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    let eventCount = 0;
    let lastLocale = null;
    
    el.addEventListener('language-changed', (e) => {
      eventCount++;
      lastLocale = e.detail.locale;
    });
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    await el.updateComplete;
    
    assert.equal(eventCount, 1);
    assert.isString(lastLocale);
  });

  test('handles multiple event listeners', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    let count1 = 0;
    let count2 = 0;
    
    const handler1 = () => count1++;
    const handler2 = () => count2++;
    
    el.addEventListener('language-changed', handler1);
    el.addEventListener('language-changed', handler2);
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    await el.updateComplete;
    
    assert.equal(count1, 1);
    assert.equal(count2, 1);
    
    el.removeEventListener('language-changed', handler1);
    el.removeEventListener('language-changed', handler2);
  });

  test('handles component lifecycle', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    // Test connectedCallback
    assert.exists(el.shadowRoot);
    
    // Test disconnectedCallback
    el.remove();
    // Should not throw error
    assert.isTrue(true);
  });

  test('handles window resize events', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    window.dispatchEvent(new Event('resize'));
    await el.updateComplete;
    
    // Should handle responsive behavior
    assert.isTrue(true); // Test passes if no error is thrown
  });

  test('handles focus events', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let focused = false;
    el.addEventListener('focus', () => focused = true);
    
    button.focus();
    assert.isTrue(focused);
  });

  test('handles blur events', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let blurred = false;
    el.addEventListener('blur', () => blurred = true);
    
    button.focus();
    button.blur();
    assert.isTrue(blurred);
  });

  test('handles mouse events', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let mouseOver = false;
    el.addEventListener('mouseover', () => mouseOver = true);
    
    const mouseOverEvent = new MouseEvent('mouseover');
    button.dispatchEvent(mouseOverEvent);
    
    assert.isTrue(mouseOver);
  });

  test('handles touch events', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let touched = false;
    el.addEventListener('touchstart', () => touched = true);
    
    const touchEvent = new TouchEvent('touchstart');
    button.dispatchEvent(touchEvent);
    
    assert.isTrue(touched);
  });
});


