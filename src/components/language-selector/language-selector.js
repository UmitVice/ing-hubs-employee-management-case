import { LitElement, html } from 'lit';
import { loadMessages } from '@/i18n/i18n.js'; 
import { adoptStylesheets } from '@/utils/style-loader.js';
import { assetUrl } from '@/utils/asset.js';

const TR_FLAG_URL = assetUrl('flags/tr.png'); 
const US_FLAG_URL = assetUrl('flags/us.png'); 

export class LanguageSelector extends LitElement {
    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./language-selector.css', import.meta.url)]);
    }

    static properties = {
        currentLocale: { type: String, state: true },
        languages: { type: Array }
    };

    constructor() {
        super();
        this.currentLocale = document.documentElement.lang.startsWith('tr') ? 'tr' : 'en';
        this.languages = ['en', 'tr'];
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
                role="button"
                @click=${() => this.changeLocale(nextLocale)}
                @keydown=${(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.changeLocale(nextLocale);
                    }
                }}
                @focus=${() => this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }))}
                @blur=${() => this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }))}
                @mouseover=${() => this.dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }))}
                @touchstart=${() => this.dispatchEvent(new CustomEvent('touchstart', { bubbles: true, composed: true }))}
                aria-label="${label}"
                title="${label}"
            >
                <img src="${icon}" alt="${label}" class="flag-icon" />
            </button>
        `;
    }
}
customElements.define('language-selector', LanguageSelector);


