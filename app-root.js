// @ts-check
import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import '@/employee-list/employee-list.js';
import '@/employee-form/employee-form.js';
import '@/components/language-selector/language-selector.js';
import '@/components/app-navbar/app-navbar.js';
import { loadMessages } from '@/i18n/i18n.js';

export class AppRoot extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                min-height: var(--min-height-screen);
                background-color: var(--color-background-light);
            }
            .title {
                max-width: var(--container-max-width);
                margin: var(--spacing-l) auto var(--spacing-s) auto;
                padding: 0 var(--spacing-xl);
                color: var(--color-primary);
                font-size: var(--font-size-large);
                font-weight: 600;
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
            <app-navbar></app-navbar>
            <main></main>
        `;
    }
}

customElements.define('app-root', AppRoot);