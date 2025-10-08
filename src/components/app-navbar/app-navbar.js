import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { withBase } from '@/utils/base-path.js';
import { t as translate } from '@/i18n/i18n.js';
import '@/components/language-selector/language-selector.js';
import { adoptStylesheets } from '@/utils/style-loader.js';
import { assetUrl } from '@/utils/asset.js';

const LOGO_URL = assetUrl('ing_logo.webp');

export class AppNavbar extends LitElement {
    static properties = {
        _lang: { type: String, state: true },
        mobileMenuOpen: { type: Boolean, state: true }
    };

    constructor() {
        super();
        this._lang = 'en';
        this.mobileMenuOpen = false;
        this.style.visibility = 'hidden';
        this._onLanguageChanged = () => {
            this._lang = document.documentElement.lang || 'en';
            this.requestUpdate();
        };
        this._onKeydown = this._onKeydown.bind(this);
        this._onResize = this._onResize.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('language-changed', this._onLanguageChanged);
        document.addEventListener('keydown', this._onKeydown);
        window.addEventListener('resize', this._onResize);
    }

    disconnectedCallback() {
        document.removeEventListener('language-changed', this._onLanguageChanged);
        document.removeEventListener('keydown', this._onKeydown);
        window.removeEventListener('resize', this._onResize);
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

    _toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    _onKeydown(e) {
        if (e.key === 'Escape' && this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
        }
    }

    _onResize() {
        // Handle responsive behavior
        if (window.innerWidth > 768) {
            this.mobileMenuOpen = false;
        }
    }

    _updateActiveState() {
        const currentPath = window.location.pathname;
        const navButtons = this.shadowRoot.querySelectorAll('.text-button');
        navButtons.forEach(button => {
            const href = button.getAttribute('href');
            if (href === currentPath || (href === '/' && currentPath === '/')) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    render() {
        return html`
            <nav class="navbar" role="navigation" aria-label="Main navigation">
                <div class="navbar-inner">
                    <button class="brand" @click=${() => this._go('/')}
                        aria-label="ING Home" title="ING Home">
                        <img class="logo" src="${LOGO_URL}" alt="ING" />
                        <span class="brand-text">ING</span>
                    </button>

                    <div class="spacer"></div>

                    <div class="nav-items" role="menubar" aria-label="Navigation menu">
                        <button class="text-button" role="menuitem" href="/" @click=${() => this._go('/')}>${this.t('employees')}</button>
                        <button class="text-button" role="menuitem" href="/add" @click=${() => this._go('/add')}>
                            <span class="plus" aria-hidden="true">+</span>
                            <span>${this.t('addNew')}</span>
                        </button>
                        <language-selector></language-selector>
                    </div>
                    
                </div>

            </nav>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);


