import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import '@/components/language-selector/language-selector.js';
import { adoptStylesheets } from '@/utils/style-loader.js';

const LOGO_URL = '/assets/ing_logo.webp';

export class AppNavbar extends LitElement {
    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./app-navbar.css', import.meta.url)]);
    }

    _go(path) {
        Router.go(path);
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
                        <button class="link" @click=${() => this._go('/')}>Employees</button>
                        <button class="text-button" @click=${() => this._go('/add')}>
                            <span class="plus" aria-hidden="true">+</span>
                            <span>Add New</span>
                        </button>
                        <language-selector></language-selector>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);


