import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';

export class AppButton extends LitElement {
    static properties = {
        variant: { type: String },
        disabled: { type: Boolean },
        type: { type: String }
    };

    constructor() {
        super();
        this.variant = 'primary';
        this.disabled = false;
        this.type = 'button';
    }

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./app-button.css', import.meta.url)]);
    }

    _onClick(e) {
        if (this.disabled) { e.preventDefault(); return; }
        this.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    }

    render() {
        return html`
            <button part="button" class="btn ${this.variant}" ?disabled=${this.disabled} @click=${this._onClick}>
                <slot></slot>
            </button>
        `;
    }
}

customElements.define('app-button', AppButton);


