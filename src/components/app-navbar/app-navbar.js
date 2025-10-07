import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import '@/components/language-selector/language-selector.js';

const LOGO_URL = '/assets/ing_logo.webp';

export class AppNavbar extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        .navbar {
            background-color: var(--color-surface);
            box-shadow: var(--shadow-subtle);
        }
        .navbar-inner {
            display: flex;
            align-items: center;
            max-width: var(--container-max-width);
            margin: var(--spacing-none) auto;
            padding: var(--spacing-s) var(--spacing-xl);
        }
        .brand {
            display: inline-flex;
            align-items: center;
            gap: var(--spacing-m);
            background: none;
            border: none;
            cursor: pointer;
            padding: var(--spacing-xs) var(--spacing-s);
            border-radius: var(--border-radius-base);
        }
        .logo {
            width: 1.25rem;
            height: 1.25rem;
            display: block;
        }
        .brand-text {
            color: var(--color-text-dark);
            font-weight: bold;
            display: inline-flex;
            align-items: center;
            line-height: 2;
        }
        .spacer {
            flex: 1;
        }
        .nav-actions {
            display: inline-flex;
            align-items: center;
            gap: var(--spacing-m);
        }
        .link {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-primary);
            padding: var(--spacing-xs) var(--spacing-s);
            border-radius: var(--border-radius-base);
        }
        .text-button {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-primary);
            padding: var(--spacing-xs) var(--spacing-s);
            border-radius: var(--border-radius-base);
            display: inline-flex;
            align-items: center;
        }
        .plus {
            margin-right: var(--spacing-xs);
            font-size: var(--size-icon-lg);
            line-height: 1;
        }
        @media (max-width: 640px) {
            .navbar-inner {
                padding-left: var(--spacing-m);
                padding-right: var(--spacing-m);
            }
            .brand-text {
                display: none;
            }
        }
    `;

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


