import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';

export class AppButton extends LitElement {
    static properties = {
        variant: { type: String },
        disabled: { type: Boolean },
        loading: { type: Boolean },
        size: { type: String },
        fullwidth: { type: Boolean },
        type: { type: String },
        form: { type: String },
        name: { type: String },
        value: { type: String }
    };

    constructor() {
        super();
        this.variant = 'primary';
        this.disabled = false;
        this.loading = false;
        this.size = 'medium';
        this.fullwidth = false;
        this.type = 'button';
        this.form = '';
        this.name = '';
        this.value = '';
    }

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./app-button.css', import.meta.url)]);
    }

    _onClick(e) {
        if (this.disabled || this.loading) { 
            e.preventDefault(); 
            return; 
        }
        this.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    }

    _onKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._onClick(e);
        }
    }

    render() {
        const classes = [
            'btn',
            this.variant,
            this.size,
            this.fullwidth ? 'fullwidth' : '',
            this.loading ? 'loading' : '',
            this.disabled ? 'disabled' : ''
        ].filter(Boolean).join(' ');

        return html`
            <button 
                part="button" 
                class="${classes}" 
                type="${this.type}" 
                ?disabled=${this.disabled || this.loading}
                ?loading=${this.loading}
                form="${this.form}"
                name="${this.name}"
                value="${this.value}"
                @click=${this._onClick}
                @keydown=${this._onKeydown}
            >
                ${this.loading ? html`
                    <div class="spinner" aria-hidden="true"></div>
                ` : ''}
                <span class="button-text" ?hidden=${this.loading}>
                    <slot></slot>
                </span>
            </button>
        `;
    }
}

customElements.define('app-button', AppButton);


