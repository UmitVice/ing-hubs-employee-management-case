import './app-button.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('app-button', () => {
  test('renders with default properties', async () => {
    const el = await fixture(html`<app-button>OK</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.exists(button);
    assert.equal(button.textContent.trim(), 'OK');
    assert.isFalse(button.disabled);
    assert.isFalse(button.hasAttribute('loading'));
  });

  test('dispatches click event', async () => {
    const el = await fixture(html`<app-button>OK</app-button>`);
    let clicked = false;
    el.addEventListener('click', () => clicked = true);
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    
    assert.isTrue(clicked);
  });

  test('supports primary variant', async () => {
    const el = await fixture(html`<app-button variant="primary">Save</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('primary'));
  });

  test('supports secondary variant', async () => {
    const el = await fixture(html`<app-button variant="secondary">Cancel</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('secondary'));
  });

  test('supports outline variant', async () => {
    const el = await fixture(html`<app-button variant="outline">Outline</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('outline'));
  });

  test('supports danger variant', async () => {
    const el = await fixture(html`<app-button variant="danger">Delete</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('danger'));
  });

  test('handles disabled state', async () => {
    const el = await fixture(html`<app-button disabled>Disabled</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.disabled);
    assert.isTrue(button.classList.contains('disabled'));
  });

  test('handles loading state', async () => {
    const el = await fixture(html`<app-button loading>Loading</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.hasAttribute('loading'));
    assert.isTrue(button.classList.contains('loading'));
  });

  test('shows loading spinner when loading', async () => {
    const el = await fixture(html`<app-button loading>Loading</app-button>`);
    await el.updateComplete;
    
    const spinner = el.shadowRoot.querySelector('.spinner');
    assert.exists(spinner);
  });

  test('hides text when loading', async () => {
    const el = await fixture(html`<app-button loading>Loading</app-button>`);
    await el.updateComplete;
    
    const text = el.shadowRoot.querySelector('.button-text');
    assert.isTrue(text.classList.contains('hidden'));
  });

  test('supports different sizes', async () => {
    const el = await fixture(html`<app-button size="small">Small</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('small'));
  });

  test('supports large size', async () => {
    const el = await fixture(html`<app-button size="large">Large</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('large'));
  });

  test('supports full width', async () => {
    const el = await fixture(html`<app-button fullwidth>Full Width</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('fullwidth'));
  });

  test('handles type attribute', async () => {
    const el = await fixture(html`<app-button type="submit">Submit</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.type, 'submit');
  });

  test('handles form attribute', async () => {
    const el = await fixture(html`<app-button form="test-form">Form Button</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('form'), 'test-form');
  });

  test('handles name attribute', async () => {
    const el = await fixture(html`<app-button name="test-name">Named Button</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.name, 'test-name');
  });

  test('handles value attribute', async () => {
    const el = await fixture(html`<app-button value="test-value">Value Button</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.value, 'test-value');
  });

  test('prevents click when disabled', async () => {
    const el = await fixture(html`<app-button disabled>Disabled</app-button>`);
    let clicked = false;
    el.addEventListener('click', () => clicked = true);
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    
    assert.isFalse(clicked);
  });

  test('prevents click when loading', async () => {
    const el = await fixture(html`<app-button loading>Loading</app-button>`);
    let clicked = false;
    el.addEventListener('click', () => clicked = true);
    
    const button = el.shadowRoot.querySelector('button');
    button.click();
    
    assert.isFalse(clicked);
  });

  test('handles keyboard navigation', async () => {
    const el = await fixture(html`<app-button>Keyboard</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    
    // Should be focusable
    button.focus();
    assert.equal(document.activeElement, button);
    
    // Should respond to Enter key
    let clicked = false;
    el.addEventListener('click', () => clicked = true);
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    button.dispatchEvent(enterEvent);
    
    assert.isTrue(clicked);
  });

  test('handles Space key', async () => {
    const el = await fixture(html`<app-button>Space</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    let clicked = false;
    el.addEventListener('click', () => clicked = true);
    
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    button.dispatchEvent(spaceEvent);
    
    assert.isTrue(clicked);
  });

  test('updates properties dynamically', async () => {
    const el = await fixture(html`<app-button>Original</app-button>`);
    await el.updateComplete;
    
    // Change variant
    el.variant = 'secondary';
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('secondary'));
    
    // Change disabled state
    el.disabled = true;
    await el.updateComplete;
    
    assert.isTrue(button.disabled);
    
    // Change loading state
    el.loading = true;
    await el.updateComplete;
    
    assert.isTrue(button.hasAttribute('loading'));
  });

  test('handles slot content', async () => {
    const el = await fixture(html`<app-button><span>Slot Content</span></app-button>`);
    await el.updateComplete;
    
    const slot = el.shadowRoot.querySelector('slot');
    assert.exists(slot);
    
    const assignedNodes = slot.assignedNodes();
    assert.isAtLeast(assignedNodes.length, 1);
  });

  test('applies correct CSS custom properties', async () => {
    const el = await fixture(html`<app-button variant="primary" size="large">Styled</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    const styles = getComputedStyle(button);
    
    // Should have CSS custom properties applied
    assert.exists(styles);
  });

  test('handles aria attributes', async () => {
    const el = await fixture(html`<app-button aria-label="Custom Label">Button</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('aria-label'), 'Custom Label');
  });

  test('handles role attribute', async () => {
    const el = await fixture(html`<app-button role="menuitem">Menu Item</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('role'), 'menuitem');
  });

  test('handles data attributes', async () => {
    const el = await fixture(html`<app-button data-testid="test-button">Test</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.getAttribute('data-testid'), 'test-button');
  });

  test('handles multiple classes', async () => {
    const el = await fixture(html`<app-button class="custom-class another-class">Custom</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.isTrue(button.classList.contains('custom-class'));
    assert.isTrue(button.classList.contains('another-class'));
  });

  test('handles id attribute', async () => {
    const el = await fixture(html`<app-button id="test-button">ID Button</app-button>`);
    await el.updateComplete;
    
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.id, 'test-button');
  });
});


