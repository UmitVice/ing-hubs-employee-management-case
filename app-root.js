import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './src/employee-list.js';
import './src/employee-form.js';
import './src/components/language-selector.js';
import { loadMessages } from './src/i18n/i18n.js';

export class AppRoot extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                min-height: var(--min-height-screen);
                background-color: var(--color-background-light);
            }
            header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: var(--spacing-none) var(--spacing-xl);
            }
            main {
                max-width: var(--container-max-width);
                margin: var(--spacing-none) auto;
                padding: var(--spacing-none) var(--spacing-xl);
            }
        `;
    }

    
    /* Initializes the Vaadin Router after the component is first rendered. */
     
    async firstUpdated() {
        await loadMessages();
        const outlet = this.shadowRoot.querySelector('main');
        
        const router = new Router(outlet);
        router.setRoutes([
            {
                path: '/',
                component: 'employee-list'
            },
            {
                path: '/add',
                component: 'employee-form'
            },
            {
                path: '/edit/:id',
                component: 'employee-form'
            },
            {
                path: '(.*)',
                component: 'app-not-found',
                action: async () => {
                    if (!customElements.get('app-not-found')) {
                        class AppNotFound extends LitElement {
                            render() { return html`<h1>404 | Not Found</h1>`; }
                        }
                        customElements.define('app-not-found', AppNotFound);
                    }
                }
            }
        ]);
    }

    render() {
        return html`
            <header>
                <language-selector></language-selector>
            </header>
            <main></main>
        `;
    }
}

customElements.define('app-root', AppRoot);