import { LitElement, html, css } from 'lit';
import { loadMessages } from '@/i18n/i18n.js'; 

const TR_FLAG_URL = '/assets/flags/tr.png'; 
const US_FLAG_URL = '/assets/flags/us.png'; 

export class LanguageSelector extends LitElement {
    static styles = css`
        :host { display: inline-block; }
        button {
            background: none;
            border: var(--border-width-thin) solid transparent;
            cursor: pointer;
            padding: var(--spacing-xs);
            opacity: 0.6;
            transition: opacity var(--transition-speed-fast), border-color var(--transition-speed-fast);
            border-radius: var(--border-radius-base);
        }
        button:hover { opacity: 0.8; }
        button.active { opacity: 1; }
        .flag-icon { width: 2.0rem; height: 1.5rem; display: block; }
    `;

    static properties = {
        currentLocale: { type: String, state: true }
    };

    constructor() {
        super();
        this.currentLocale = document.documentElement.lang.startsWith('tr') ? 'tr' : 'en';
        this._onLanguageChanged = (e) => {
            const locale = document.documentElement.lang.startsWith('tr') ? 'tr' : 'en';
            if (this.currentLocale !== locale) {
                this.currentLocale = locale;
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();
        document.addEventListener('language-changed', this._onLanguageChanged);
    }

    disconnectedCallback() {
        document.removeEventListener('language-changed', this._onLanguageChanged);
        super.disconnectedCallback();
    }

    /**
     * Changes the application's locale, reloads messages, and notifies the parent app.
     * @param {string} newLocale - The new locale ('en' or 'tr').
     */
    async changeLocale(newLocale) {
        if (this.currentLocale === newLocale) {
            return;
        }
        
        document.documentElement.lang = newLocale;
        
        await loadMessages();
        
        this.currentLocale = newLocale;
        
        this.dispatchEvent(new CustomEvent('language-changed', {
            detail: { locale: newLocale },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        const isTR = this.currentLocale === 'tr';
        const nextLocale = isTR ? 'en' : 'tr';
        const icon = isTR ? US_FLAG_URL : TR_FLAG_URL;
        const label = isTR ? 'Switch language to English' : 'Switch language to Turkish';
        return html`
            <button
                class="active"
                @click=${() => this.changeLocale(nextLocale)}
                aria-label="${label}"
                title="${label}"
            >
                <img src="${icon}" alt="${label}" class="flag-icon" />
            </button>
        `;
    }
}
customElements.define('language-selector', LanguageSelector);


