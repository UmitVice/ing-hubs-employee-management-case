// @ts-check
import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';

export class PageContainer extends LitElement {
    static properties = {
        title: { type: String }
    };

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./page-container.css', import.meta.url)]);
    }

    constructor() {
        super();
        this.title = '';
    }

    render() {
        return html`
            <div class="page-wrapper">
                <div class="title-section" part="title">
                    ${this.title ? html`<h2 class="page-title">${this.title}</h2>` : html`<slot name="title"></slot>`}
                </div>
                <div class="page-content" part="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('page-container', PageContainer);

