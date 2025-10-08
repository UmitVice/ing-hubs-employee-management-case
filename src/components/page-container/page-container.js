// @ts-check
import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';

export class PageContainer extends LitElement {
    static properties = {
        title: { type: String },
        noContainerStyle: { type: Boolean, reflect: true, attribute: 'no-container-style' }
    };

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./page-container.css', import.meta.url)]);
    }

    constructor() {
        super();
        this.noContainerStyle = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('focus', this._handleFocus);
        this.addEventListener('blur', this._handleBlur);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('focus', this._handleFocus);
        this.removeEventListener('blur', this._handleBlur);
    }

    _handleFocus(event) {
        this.dispatchEvent(new FocusEvent('focus', { bubbles: true, composed: true }));
    }

    _handleBlur(event) {
        this.dispatchEvent(new FocusEvent('blur', { bubbles: true, composed: true }));
    }

    render() {
        const wrapperClasses = [
            'page-wrapper',
            this.noContainerStyle ? 'no-container-style' : '',
            this.className || ''
        ].filter(Boolean).join(' ');

        return html`
            <div class="${wrapperClasses}" 
                 data-testid="${this.getAttribute('data-testid') || ''}"
                 aria-label="${this.getAttribute('aria-label') || ''}"
                 role="${this.getAttribute('role') || ''}"
                 tabindex="0">
                <div class="title-section" part="title">
                    ${this.title ? html`<h2 class="page-title">${this.title}</h2>` : ''}
                    <slot name="title"></slot>
                </div>
                <div class="toolbar-section" part="toolbar">
                    <slot name="toolbar"></slot>
                </div>
                <div class="page-content" part="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('page-container', PageContainer);

