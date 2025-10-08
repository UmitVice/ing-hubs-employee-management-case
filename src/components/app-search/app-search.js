import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';
import { formatDateToDDMMYYYY, formatDigitsToDDMMYYYY, parseDDMMYYYYToISO } from '@/utils/date.js';

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
        let val = e.target.value;
        if (this.type === 'date') {
            const formatted = formatDigitsToDDMMYYYY(val);
            e.target.value = formatted;
            // Emit partial dd/mm/yyyy progressively; when complete, emit ISO
            if (formatted.length === 10) {
                const iso = parseDDMMYYYYToISO(formatted);
                if (iso) {
                    val = iso;
                } else {
                    // invalid full date; keep partial string
                    val = formatted;
                }
            } else {
                val = formatted; // partial or empty
            }
        }
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
        const isDate = this.type === 'date';
        // For date type, if internal value is ISO show dd/mm/yyyy, otherwise show the partial dd/mm/yyyy as-is
        const isIso = isDate && /^\d{4}-\d{2}-\d{2}$/.test(this.value || '');
        const displayValue = isDate
            ? (isIso ? (formatDateToDDMMYYYY(this.value) || '') : (this.value || ''))
            : this.value;
        const inputType = isDate ? 'text' : this.type;
        const inputMode = isDate ? 'numeric' : undefined;
        const placeholder = this.placeholder || (isDate ? 'dd/mm/yyyy' : '');
        return html`
            <div class="${classes}">
                <input
                    type="${inputType}"
                    inputmode="${inputMode || ''}"
                    maxlength="${isDate ? 10 : ''}"
                    .value=${displayValue}
                    placeholder=${placeholder}
                    @input=${this._onInput}
                />
            </div>
        `;
    }
}

customElements.define('app-search', AppSearch);


