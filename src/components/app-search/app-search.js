import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';

export class AppSearch extends LitElement {
    static properties = {
        value: { type: String },
        placeholder: { type: String },
        type: { type: String },
        debounce: { type: Number },
        compact: { type: Boolean }
    };

    constructor() {
        super();
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.debounce = 0;
        this.compact = false;
        this._debounceId = null;
    }

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./app-search.css', import.meta.url)]);
    }

    _emitChange(val) {
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: val },
            bubbles: true,
            composed: true
        }));
    }

    _onInput(e) {
        const val = e.target.value;
        this.value = val;
        if (this.debounce > 0) {
            if (this._debounceId) window.clearTimeout(this._debounceId);
            this._debounceId = window.setTimeout(() => this._emitChange(val), this.debounce);
        } else {
            this._emitChange(val);
        }
    }

    render() {
        const classes = [ 'search', this.compact ? 'compact' : '' ].join(' ').trim();
        return html`
            <div class="${classes}">
                <input
                    type="${this.type}"
                    .value=${this.value}
                    placeholder=${this.placeholder}
                    @input=${this._onInput}
                />
            </div>
        `;
    }
}

customElements.define('app-search', AppSearch);


