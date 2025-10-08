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
});

