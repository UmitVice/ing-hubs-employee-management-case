import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';
import { formatDateToDDMMYYYY, formatDigitsToDDMMYYYY, parseDDMMYYYYToISO } from '@/utils/date.js';

export class AppSearch extends LitElement {
    static properties = {
        value: { type: String },
        placeholder: { type: String },
        type: { type: String },
        debounce: { type: Number },
        compact: { type: Boolean },
        disabled: { type: Boolean },
        readonly: { type: Boolean },
        required: { type: Boolean },
        maxlength: { type: Number },
        minlength: { type: Number },
        autocomplete: { type: String },
        autofocus: { type: Boolean },
        name: { type: String },
        id: { type: String }
    };

    constructor() {
        super();
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.debounce = 0;
        this.compact = false;
        this.disabled = false;
        this.readonly = false;
        this.required = false;
        this.maxlength = -1;
        this.minlength = -1;
        this.autocomplete = '';
        this.autofocus = false;
        this.name = '';
        this.id = '';
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
        
        // Update validation
        this._updateValidation(e.target);
        
        if (this.debounce > 0) {
            if (this._debounceId) window.clearTimeout(this._debounceId);
            this._debounceId = window.setTimeout(() => this._emitChange(val), this.debounce);
        } else {
            this._emitChange(val);
        }
    }

    _updateValidation(input) {
        // Set custom validity based on minlength
        if (this.minlength > 0 && input.value.length > 0 && input.value.length < this.minlength) {
            input.setCustomValidity(`Minimum length is ${this.minlength} characters`);
        } else {
            input.setCustomValidity('');
        }
    }

    _onKeydown(e) {
        // Dispatch the original keydown event
        this.dispatchEvent(new KeyboardEvent('keydown', {
            key: e.key,
            bubbles: true,
            composed: true
        }));
        
        if (e.key === 'Enter') {
            this.dispatchEvent(new CustomEvent('search', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        } else if (e.key === 'Escape') {
            this.value = '';
            this._emitChange('');
            e.target.value = '';
        }
    }

    _onFocus(e) {
        this.dispatchEvent(new CustomEvent('focus', {
            bubbles: true,
            composed: true
        }));
    }

    _onBlur(e) {
        this.dispatchEvent(new CustomEvent('blur', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const classes = [ 'search', this.compact ? 'compact' : '' ].join(' ').trim();
        const inputClasses = [ this.className || '' ].filter(Boolean).join(' ');
        const isDate = this.type === 'date';
        // For date type, if internal value is ISO show dd/mm/yyyy, otherwise show the partial dd/mm/yyyy as-is
        const isIso = isDate && /^\d{4}-\d{2}-\d{2}$/.test(this.value || '');
        const displayValue = isDate
            ? (isIso ? (formatDateToDDMMYYYY(this.value) || '') : (this.value || ''))
            : this.value;
        const inputType = isDate ? 'text' : this.type;
        const inputMode = isDate ? 'numeric' : undefined;
        const placeholder = this.placeholder || (isDate ? 'dd/mm/yyyy' : '');
        const maxLength = isDate ? 10 : (this.maxlength > 0 ? this.maxlength : '');
        const minLength = this.minlength > 0 ? this.minlength : '';
        
        return html`
            <div class="${classes}">
                <input
                    class="${inputClasses}"
                    type="${inputType}"
                    inputmode="${inputMode || ''}"
                    maxlength="${maxLength}"
                    minlength="${minLength}"
                    .value=${displayValue}
                    placeholder=${placeholder}
                    ?disabled=${this.disabled}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    ?autofocus=${this.autofocus}
                    autocomplete="${this.autocomplete}"
                    name="${this.name}"
                    id="${this.id}"
                    aria-label="${this.getAttribute('aria-label') || ''}"
                    aria-describedby="${this.getAttribute('aria-describedby') || ''}"
                    role="${this.getAttribute('role') || ''}"
                    data-testid="${this.getAttribute('data-testid') || ''}"
                    @input=${this._onInput}
                    @keydown=${this._onKeydown}
                    @focus=${this._onFocus}
                    @blur=${this._onBlur}
                />
                ${this.value ? html`
                    <button class="clear-button" @click=${() => {
                        this.value = '';
                        this._emitChange('');
                        this.shadowRoot.querySelector('input').value = '';
                    }} aria-label="Clear search">×</button>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('app-search', AppSearch);


