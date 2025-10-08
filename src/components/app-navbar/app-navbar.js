import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { withBase } from '@/utils/base-path.js';
import { t as translate } from '@/i18n/i18n.js';
import '@/components/language-selector/language-selector.js';
import { adoptStylesheets } from '@/utils/style-loader.js';
import '@/components/app-button/app-button.js';
import { assetUrl } from '@/utils/asset.js';

const LOGO_URL = assetUrl('ing_logo.webp');

export class AppNavbar extends LitElement {
    static properties = {
        _lang: { type: String, state: true }
    };

    constructor() {
        super();
        this._lang = 'en';
        this.style.visibility = 'hidden';
        this._onLanguageChanged = () => {
            this._lang = document.documentElement.lang || 'en';
            this.requestUpdate();
        };
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('language-changed', this._onLanguageChanged);
    }

    disconnectedCallback() {
        document.removeEventListener('language-changed', this._onLanguageChanged);
        super.disconnectedCallback();
    }

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./app-navbar.css', import.meta.url)]);

        this.style.visibility = 'visible';
    }

    t(key, params = []) {
        return translate(key, params);
    }

    _go(path) {
        Router.go(withBase(path));
    }

    render() {
        return html`
            <nav class="navbar">
                <div class="navbar-inner">
                    <button class="brand" @click=${() => this._go('/')}
                        aria-label="ING Home" title="ING Home">
                        <img class="logo" src="${LOGO_URL}" alt="ING" />
                        <span class="brand-text">ING</span>
                    </button>

                    <div class="spacer"></div>

                    <div class="nav-actions">
                        <app-button variant="secondary" @click=${() => this._go('/')}>${this.t('employees')}</app-button>
                        <app-button class="add-btn" variant="primary" @click=${() => this._go('/add')}>
                            <span class="plus" aria-hidden="true">+</span>
                            <span>${this.t('addNew')}</span>
                        </app-button>
                        <language-selector></language-selector>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);


