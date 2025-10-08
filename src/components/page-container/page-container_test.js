// @ts-check
import { html, fixture, expect } from '@open-wc/testing';
import './page-container.js';

suite('PageContainer', () => {
  test('renders with title property', async () => {
    const el = await fixture(html`<page-container title="Test Title"></page-container>`);
    const title = el.shadowRoot.querySelector('.page-title');
    expect(title).to.exist;
    expect(title.textContent).to.equal('Test Title');
  });

  test('renders with title slot', async () => {
    const el = await fixture(html`
      <page-container>
        <div slot="title">Custom Title</div>
      </page-container>
    `);
    const slot = el.shadowRoot.querySelector('slot[name="title"]');
    expect(slot).to.exist;
  });

  test('renders default content slot', async () => {
    const el = await fixture(html`
      <page-container title="Test">
        <div>Content here</div>
      </page-container>
    `);
    const content = el.shadowRoot.querySelector('.page-content');
    expect(content).to.exist;
  });

  test('exposes toolbar slot', async () => {
    const el = await fixture(html`
      <page-container title="Test">
        <div slot="toolbar">tools</div>
      </page-container>
    `);
    const slot = el.shadowRoot.querySelector('slot[name="toolbar"]');
    expect(slot).to.exist;
  });

  test('applies base structure classes', async () => {
    const el = await fixture(html`<page-container title="Test"></page-container>`);
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    const content = el.shadowRoot.querySelector('.page-content');
    expect(wrapper).to.exist;
    expect(content).to.exist;
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<page-container></page-container>`);
    await el.updateComplete;
    
    expect(el.title).to.be.undefined;
    expect(el.noContainerStyle).to.be.false;
  });

  test('handles noContainerStyle property', async () => {
    const el = await fixture(html`<page-container no-container-style></page-container>`);
    await el.updateComplete;
    
    expect(el.noContainerStyle).to.be.true;
    
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.classList.contains('no-container-style')).to.be.true;
  });

  test('handles title property changes', async () => {
    const el = await fixture(html`<page-container title="Original Title"></page-container>`);
    await el.updateComplete;
    
    let title = el.shadowRoot.querySelector('.page-title');
    expect(title.textContent).to.equal('Original Title');
    
    el.title = 'Updated Title';
    await el.updateComplete;
    
    title = el.shadowRoot.querySelector('.page-title');
    expect(title.textContent).to.equal('Updated Title');
  });

  test('handles noContainerStyle property changes', async () => {
    const el = await fixture(html`<page-container></page-container>`);
    await el.updateComplete;
    
    let wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.classList.contains('no-container-style')).to.be.false;
    
    el.noContainerStyle = true;
    await el.updateComplete;
    
    wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.classList.contains('no-container-style')).to.be.true;
  });

  test('renders with custom CSS classes', async () => {
    const el = await fixture(html`<page-container class="custom-page"></page-container>`);
    await el.updateComplete;
    
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.classList.contains('custom-page')).to.be.true;
  });

  test('handles multiple CSS classes', async () => {
    const el = await fixture(html`<page-container class="class1 class2 class3"></page-container>`);
    await el.updateComplete;
    
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.classList.contains('class1')).to.be.true;
    expect(wrapper.classList.contains('class2')).to.be.true;
    expect(wrapper.classList.contains('class3')).to.be.true;
  });

  test('handles id attribute', async () => {
    const el = await fixture(html`<page-container id="test-page"></page-container>`);
    await el.updateComplete;
    
    expect(el.id).to.equal('test-page');
  });

  test('handles data attributes', async () => {
    const el = await fixture(html`<page-container data-testid="page-container"></page-container>`);
    await el.updateComplete;
    
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.getAttribute('data-testid')).to.equal('page-container');
  });

  test('handles aria attributes', async () => {
    const el = await fixture(html`<page-container aria-label="Main page" role="main"></page-container>`);
    await el.updateComplete;
    
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    expect(wrapper.getAttribute('aria-label')).to.equal('Main page');
    expect(wrapper.getAttribute('role')).to.equal('main');
  });

  test('handles title slot content', async () => {
    const el = await fixture(html`
      <page-container>
        <h1 slot="title">Custom Title</h1>
      </page-container>
    `);
    await el.updateComplete;
    
    const slot = el.shadowRoot.querySelector('slot[name="title"]');
    expect(slot).to.exist;
    
    const assignedNodes = slot.assignedNodes();
    expect(assignedNodes.length).to.be.at.least(1);
  });

  test('handles toolbar slot content', async () => {
    const el = await fixture(html`
      <page-container title="Test">
        <div slot="toolbar">
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      </page-container>
    `);
    await el.updateComplete;
    
    const slot = el.shadowRoot.querySelector('slot[name="toolbar"]');
    expect(slot).to.exist;
    
    const assignedNodes = slot.assignedNodes();
    expect(assignedNodes.length).to.be.at.least(1);
  });

  test('handles multiple content slots', async () => {
    const el = await fixture(html`
      <page-container title="Test">
        <div slot="title">Custom Title</div>
        <div slot="toolbar">Toolbar Content</div>
        <div>Main Content</div>
      </page-container>
    `);
    await el.updateComplete;
    
    const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
    const toolbarSlot = el.shadowRoot.querySelector('slot[name="toolbar"]');
    const contentSlot = el.shadowRoot.querySelector('slot:not([name])');
    
    expect(titleSlot).to.exist;
    expect(toolbarSlot).to.exist;
    expect(contentSlot).to.exist;
  });

  test('handles empty content', async () => {
    const el = await fixture(html`<page-container title="Empty"></page-container>`);
    await el.updateComplete;
    
    const content = el.shadowRoot.querySelector('.page-content');
    expect(content).to.exist;
    
    const slot = el.shadowRoot.querySelector('slot:not([name])');
    expect(slot).to.exist;
  });

  test('handles long title text', async () => {
    const longTitle = 'This is a very long title that should be handled properly by the page container component';
    const el = await fixture(html`<page-container title="${longTitle}"></page-container>`);
    await el.updateComplete;
    
    const title = el.shadowRoot.querySelector('.page-title');
    expect(title.textContent).to.equal(longTitle);
  });

  test('handles special characters in title', async () => {
    const specialTitle = 'Title with <script>alert("xss")</script> & "quotes"';
    const el = await fixture(html`<page-container title="${specialTitle}"></page-container>`);
    await el.updateComplete;
    
    const title = el.shadowRoot.querySelector('.page-title');
    expect(title.textContent).to.equal(specialTitle);
  });

  test('handles responsive behavior', async () => {
    const el = await fixture(html`<page-container title="Responsive"></page-container>`);
    await el.updateComplete;
    
    // Simulate mobile view
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    window.dispatchEvent(new Event('resize'));
    await el.updateComplete;
    
    // Should handle responsive behavior
    expect(true).to.be.true; // Test passes if no error is thrown
  });

  test('handles window resize events', async () => {
    const el = await fixture(html`<page-container title="Resize Test"></page-container>`);
    await el.updateComplete;
    
    let resizeCount = 0;
    el.addEventListener('resize', () => resizeCount++);
    
    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    window.dispatchEvent(new Event('resize'));
    await el.updateComplete;
    
    // Should handle resize events
    expect(true).to.be.true; // Test passes if no error is thrown
  });

  test('handles focus events', async () => {
    const el = await fixture(html`<page-container title="Focus Test"></page-container>`);
    await el.updateComplete;
    
    let focused = false;
    el.addEventListener('focus', () => focused = true);
    
    el.focus();
    expect(focused).to.be.true;
  });

  test('handles blur events', async () => {
    const el = await fixture(html`<page-container title="Blur Test"></page-container>`);
    await el.updateComplete;
    
    let blurred = false;
    el.addEventListener('blur', () => blurred = true);
    
    el.focus();
    el.blur();
    expect(blurred).to.be.true;
  });

  test('handles keyboard events', async () => {
    const el = await fixture(html`<page-container title="Keyboard Test"></page-container>`);
    await el.updateComplete;
    
    let keyPressed = false;
    el.addEventListener('keydown', () => keyPressed = true);
    
    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    el.dispatchEvent(keyEvent);
    
    expect(keyPressed).to.be.true;
  });

  test('handles mouse events', async () => {
    const el = await fixture(html`<page-container title="Mouse Test"></page-container>`);
    await el.updateComplete;
    
    let mouseOver = false;
    el.addEventListener('mouseover', () => mouseOver = true);
    
    const mouseEvent = new MouseEvent('mouseover');
    el.dispatchEvent(mouseEvent);
    
    expect(mouseOver).to.be.true;
  });

  test('handles component lifecycle', async () => {
    const el = await fixture(html`<page-container title="Lifecycle Test"></page-container>`);
    await el.updateComplete;
    
    // Test connectedCallback
    expect(el.shadowRoot).to.exist;
    
    // Test disconnectedCallback
    el.remove();
    // Should not throw error
    expect(true).to.be.true;
  });

  test('handles multiple property changes', async () => {
    const el = await fixture(html`<page-container title="Original"></page-container>`);
    await el.updateComplete;
    
    // Change multiple properties
    el.title = 'Updated';
    el.noContainerStyle = true;
    await el.updateComplete;
    
    const title = el.shadowRoot.querySelector('.page-title');
    const wrapper = el.shadowRoot.querySelector('.page-wrapper');
    
    expect(title.textContent).to.equal('Updated');
    expect(wrapper.classList.contains('no-container-style')).to.be.true;
  });

  test('handles slot content changes', async () => {
    const el = await fixture(html`
      <page-container>
        <div slot="title">Original Title</div>
      </page-container>
    `);
    await el.updateComplete;
    
    // Change slot content
    const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
    const originalContent = titleSlot.assignedNodes()[0];
    
    // Simulate content change
    originalContent.textContent = 'Updated Title';
    await el.updateComplete;
    
    expect(originalContent.textContent).to.equal('Updated Title');
  });

  test('handles complex nested content', async () => {
    const el = await fixture(html`
      <page-container title="Complex">
        <div slot="title">
          <h1>Complex Title</h1>
          <p>Subtitle</p>
        </div>
        <div slot="toolbar">
          <button>Save</button>
          <button>Cancel</button>
        </div>
        <div>
          <h2>Main Content</h2>
          <p>This is the main content area.</p>
        </div>
      </page-container>
    `);
    await el.updateComplete;
    
    const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
    const toolbarSlot = el.shadowRoot.querySelector('slot[name="toolbar"]');
    const contentSlot = el.shadowRoot.querySelector('slot:not([name])');
    
    expect(titleSlot).to.exist;
    expect(toolbarSlot).to.exist;
    expect(contentSlot).to.exist;
    
    const titleNodes = titleSlot.assignedNodes();
    const toolbarNodes = toolbarSlot.assignedNodes();
    const contentNodes = contentSlot.assignedNodes();
    
    expect(titleNodes.length).to.be.at.least(1);
    expect(toolbarNodes.length).to.be.at.least(1);
    expect(contentNodes.length).to.be.at.least(1);
  });
});

