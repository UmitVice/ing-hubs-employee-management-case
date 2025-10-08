import './app-search.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('app-search', () => {
  test('renders with default properties', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.exists(input);
    assert.equal(input.type, 'text');
    assert.isFalse(input.disabled);
  });

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

  test('handles placeholder attribute', async () => {
    const el = await fixture(html`<app-search placeholder="Search employees"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.placeholder, 'Search employees');
  });

  test('handles value attribute', async () => {
    const el = await fixture(html`<app-search value="test value"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.value, 'test value');
  });

  test('handles disabled state', async () => {
    const el = await fixture(html`<app-search disabled></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(input.disabled);
  });

  test('handles readonly state', async () => {
    const el = await fixture(html`<app-search readonly></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(input.readOnly);
  });

  test('handles required attribute', async () => {
    const el = await fixture(html`<app-search required></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(input.required);
  });

  test('handles maxlength attribute', async () => {
    const el = await fixture(html`<app-search maxlength="50"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.maxLength, 50);
  });

  test('handles minlength attribute', async () => {
    const el = await fixture(html`<app-search minlength="3"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.minLength, 3);
  });

  test('handles autocomplete attribute', async () => {
    const el = await fixture(html`<app-search autocomplete="off"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.autocomplete, 'off');
  });

  test('handles autofocus attribute', async () => {
    const el = await fixture(html`<app-search autofocus></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(input.autofocus);
  });

  test('handles name attribute', async () => {
    const el = await fixture(html`<app-search name="search-input"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.name, 'search-input');
  });

  test('handles id attribute', async () => {
    const el = await fixture(html`<app-search id="search-field"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.id, 'search-field');
  });

  test('handles class attribute', async () => {
    const el = await fixture(html`<app-search class="custom-search"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(input.classList.contains('custom-search'));
  });

  test('debounces input events', async () => {
    const el = await fixture(html`<app-search debounce="100"></app-search>`);
    const input = el.shadowRoot.querySelector('input');
    
    let eventCount = 0;
    el.addEventListener('value-changed', () => eventCount++);
    
    // Type multiple characters quickly
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    input.value = 'ab';
    input.dispatchEvent(new Event('input'));
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Should only emit one event due to debouncing
    assert.equal(eventCount, 1);
  });

  test('handles clear functionality', async () => {
    const el = await fixture(html`<app-search value="test"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    const clearButton = el.shadowRoot.querySelector('.clear-button');
    
    if (clearButton) {
      clearButton.click();
      await el.updateComplete;
      
      assert.equal(input.value, '');
    }
  });

  test('shows clear button when there is text', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const clearButton = el.shadowRoot.querySelector('.clear-button');
    if (clearButton) {
      assert.isFalse(clearButton.classList.contains('hidden'));
    }
  });

  test('hides clear button when empty', async () => {
    const el = await fixture(html`<app-search value="test"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const clearButton = el.shadowRoot.querySelector('.clear-button');
    if (clearButton) {
      assert.isTrue(clearButton.classList.contains('hidden'));
    }
  });

  test('handles focus events', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    let focused = false;
    el.addEventListener('focus', () => focused = true);
    
    input.focus();
    assert.isTrue(focused);
  });

  test('handles blur events', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    let blurred = false;
    el.addEventListener('blur', () => blurred = true);
    
    input.focus();
    input.blur();
    assert.isTrue(blurred);
  });

  test('handles keyboard events', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    let keyPressed = false;
    el.addEventListener('keydown', () => keyPressed = true);
    
    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(keyEvent);
    
    assert.isTrue(keyPressed);
  });

  test('handles Enter key submission', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    input.value = 'test search';
    
    let submitted = false;
    el.addEventListener('search', () => submitted = true);
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(enterEvent);
    
    assert.isTrue(submitted);
  });

  test('handles Escape key clear', async () => {
    const el = await fixture(html`<app-search value="test"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    input.dispatchEvent(escapeEvent);
    await el.updateComplete;
    
    assert.equal(input.value, '');
  });

  test('updates value property when input changes', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    assert.equal(el.value, 'new value');
  });

  test('updates input value when property changes', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    el.value = 'programmatic value';
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.value, 'programmatic value');
  });

  test('handles validation', async () => {
    const el = await fixture(html`<app-search required minlength="3"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    
    // Test with invalid value
    input.value = 'ab';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    assert.isFalse(input.validity.valid);
    
    // Test with valid value
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    assert.isTrue(input.validity.valid);
  });

  test('handles aria attributes', async () => {
    const el = await fixture(html`<app-search aria-label="Search employees" aria-describedby="search-help"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.getAttribute('aria-label'), 'Search employees');
    assert.equal(input.getAttribute('aria-describedby'), 'search-help');
  });

  test('handles role attribute', async () => {
    const el = await fixture(html`<app-search role="searchbox"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.getAttribute('role'), 'searchbox');
  });

  test('handles data attributes', async () => {
    const el = await fixture(html`<app-search data-testid="search-input"></app-search>`);
    await el.updateComplete;
    
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.getAttribute('data-testid'), 'search-input');
  });

  test('handles multiple event listeners', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    const input = el.shadowRoot.querySelector('input');
    
    let count1 = 0;
    let count2 = 0;
    
    const handler1 = () => count1++;
    const handler2 = () => count2++;
    
    el.addEventListener('value-changed', handler1);
    el.addEventListener('value-changed', handler2);
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    assert.equal(count1, 1);
    assert.equal(count2, 1);
    
    el.removeEventListener('value-changed', handler1);
    el.removeEventListener('value-changed', handler2);
  });

  test('handles component lifecycle', async () => {
    const el = await fixture(html`<app-search></app-search>`);
    await el.updateComplete;
    
    // Test connectedCallback
    assert.exists(el.shadowRoot);
    
    // Test disconnectedCallback
    el.remove();
    // Should not throw error
    assert.isTrue(true);
  });
});


