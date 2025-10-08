// @ts-check
import { html, fixture, expect } from '@open-wc/testing';
import './page-container.js';

describe('PageContainer', () => {
    it('renders with title property', async () => {
        const el = await fixture(html`<page-container title="Test Title"></page-container>`);
        const title = el.shadowRoot.querySelector('.page-title');
        expect(title).to.exist;
        expect(title.textContent).to.equal('Test Title');
    });

    it('renders with title slot', async () => {
        const el = await fixture(html`
            <page-container>
                <div slot="title">Custom Title</div>
            </page-container>
        `);
        const slot = el.shadowRoot.querySelector('slot[name="title"]');
        expect(slot).to.exist;
    });

    it('renders default content slot', async () => {
        const el = await fixture(html`
            <page-container title="Test">
                <div>Content here</div>
            </page-container>
        `);
        const content = el.shadowRoot.querySelector('.page-content');
        expect(content).to.exist;
    });

    it('applies correct CSS classes', async () => {
        const el = await fixture(html`<page-container title="Test"></page-container>`);
        const wrapper = el.shadowRoot.querySelector('.page-wrapper');
        const content = el.shadowRoot.querySelector('.page-content');
        expect(wrapper).to.exist;
        expect(content).to.exist;
    });
});

