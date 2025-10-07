// @ts-check
import { LitElement, html } from 'lit';
import { t as translate } from '@/i18n/i18n.js';
import { employeeService } from '@/employee-service.js';
import { Router } from '@vaadin/router';
import { adoptStylesheets } from '@/utils/style-loader.js';
import '@/components/confirm-dialog/confirm-dialog.js';
/** @typedef {import('@/types.js').Employee} Employee */

export class EmployeeList extends LitElement {
    static properties = {
        employees: { type: Array },
        page: { type: Number },
        pageSize: { type: Number },
        searchTerm: { type: String },
        viewFormat: { type: String }
    };

    async firstUpdated() {
        await adoptStylesheets(this.shadowRoot, [new URL('./employee-list.css', import.meta.url)]);
    }

    // Lightweight bridge to the global translator
    t(key, params = []) { return translate(key, params); }

    constructor() {
        super();
        /** @type {Employee[]} */
        this.employees = [];
        this.page = 1;
        this.pageSize = 10;
        this.searchTerm = '';
        this.viewFormat = 'table';

        this._employeeDataChanged = this._employeeDataChanged.bind(this);
        this._onLanguageChanged = () => this.requestUpdate();
        employeeService.addEventListener('employees-changed', this._employeeDataChanged);
    }
    
    disconnectedCallback() {
        employeeService.removeEventListener('employees-changed', this._employeeDataChanged);
        document.removeEventListener('language-changed', this._onLanguageChanged);
        super.disconnectedCallback();
    }

    _employeeDataChanged(e) {
        this.employees = e.detail.employees;
        this.page = 1; 
    }

    async connectedCallback() {
        super.connectedCallback();
        // Load initial data on connect
        this.employees = employeeService.employees; 
        document.addEventListener('language-changed', this._onLanguageChanged);
    }

    _setView(view) {
        this.viewFormat = view;
        this.page = 1; // reset to first page when switching view to keep UX consistent
    }

    _handleEdit(id) {
        Router.go(`/edit/${id}`);
    }

    _handleDelete(id) {
        const emp = this.employees.find(e => e.id === id);
        const dlg = /** @type {import('@/components/confirm-dialog/confirm-dialog.js').ConfirmDialog} */(this.shadowRoot.querySelector('confirm-dialog'));
        const name = emp ? `${emp.firstName} ${emp.lastName}`.trim() : '';
        const message = name ? this.t('deleteRecord', [name]) : this.t('confirmDelete');
        dlg.openWith({ title: this.t('deleteConfirmation'), message, confirmText: this.t('proceed'), cancelText: this.t('cancel'), variant: 'danger' });
        const onConfirm = () => {
            employeeService.deleteEmployee(id);
            dlg.removeEventListener('confirm', onConfirm);
            dlg.removeEventListener('cancel', onCancel);
        };
        const onCancel = () => {
            dlg.removeEventListener('confirm', onConfirm);
            dlg.removeEventListener('cancel', onCancel);
        };
        dlg.addEventListener('confirm', onConfirm);
        dlg.addEventListener('cancel', onCancel);
    }
    
    _handleSearch(e) {
        this.searchTerm = e.target.value;
        this.page = 1;
    }
    
    _handlePageChange(newPage) {
        const effectivePageSize = this.viewFormat === 'cards' ? 4 : this.pageSize;
        const maxPage = Math.ceil(this.employees.length / effectivePageSize);
        if (newPage >= 1 && newPage <= maxPage) {
            this.page = newPage;
        }
    }

    _getCurrentPageEmployees() {
        const lowerCaseSearch = this.searchTerm.toLowerCase();
        
        const filteredEmployees = this.employees.filter(emp => {
            const firstName = emp.firstName?.toLowerCase() || '';
            const lastName = emp.lastName?.toLowerCase() || '';
            const email = emp.email?.toLowerCase() || '';
            
            return (
                firstName.includes(lowerCaseSearch) ||
                lastName.includes(lowerCaseSearch) ||
                email.includes(lowerCaseSearch)
            );
        });
        
        // Pagination logic (dynamic pageSize: 4 in cards view)
        const effectivePageSize = this.viewFormat === 'cards' ? 4 : this.pageSize;
        const startIndex = (this.page - 1) * effectivePageSize;
        const endIndex = startIndex + effectivePageSize;
        
        return {
            total: filteredEmployees.length,
            records: filteredEmployees.slice(startIndex, endIndex)
        };
    }

    _buildPageList(totalPages) {
        const current = this.page;
        const pages = [];
        const push = p => pages.push(p);

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) push(i);
            return pages;
        }

        push(1);
        if (current > 4) push('...l');

        const start = Math.max(2, current - 1);
        const end = Math.min(totalPages - 1, current + 1);
        for (let i = start; i <= end; i++) push(i);

        if (current < totalPages - 3) push('...r');
        push(totalPages);
        return pages;
    }

    render() {
        const { total, records: currentEmployees } = this._getCurrentPageEmployees();
        const effectivePageSize = this.viewFormat === 'cards' ? 4 : this.pageSize;
        const totalPages = Math.ceil(total / effectivePageSize);
        const pageItems = this._buildPageList(totalPages);
        
        return html`
            <div class="employee-list-wrapper">
                <div class="header-row">
                    <h2 class="page-title">${this.t('employeeList')}</h2>
                    <div class="view-toggles">
                        <button class="icon-btn ${this.viewFormat === 'table' ? 'active' : ''}"
                            @click=${() => this._setView('table')} aria-label="Table view">
                            <img class="icon-img list" src="/assets/icons/list_icon.png" alt="Table" />
                        </button>
                        <button class="icon-btn ${this.viewFormat === 'cards' ? 'active' : ''}"
                            @click=${() => this._setView('cards')} aria-label="Cards view">
                            <img class="icon-img grid" src="/assets/icons/square_list_icon.png" alt="Cards" />
                        </button>
                    </div>
                </div>
                <div class="list-container" data-view="${this.viewFormat}">
                    
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>${this.t('firstName')}</th>
                                <th>${this.t('lastName')}</th>
                                <th>${this.t('dateOfEmployment')}</th>
                                <th>${this.t('dateOfBirth')}</th>
                                <th>${this.t('phoneNumber')}</th>
                                <th>${this.t('email')}</th>
                                <th>${this.t('department')}</th>
                                <th>${this.t('position')}</th>
                                <th>${this.t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${currentEmployees.map(
                              emp => html`
                                <tr>
                                    <td><input type="checkbox" aria-label="select" /></td>
                                    <td>${emp.firstName}</td>
                                    <td>${emp.lastName}</td>
                                    <td>${emp.dateOfEmployment}</td>
                                    <td>${emp.dateOfBirth || '-'}</td>
                                    <td>${emp.phone || '-'}</td>
                                    <td>${emp.email}</td>
                                    <td>${emp.department}</td>
                                    <td>${emp.position}</td>
                                    <td class="actions-cell">
                                        <button class="action-btn edit" @click=${() => this._handleEdit(emp.id)} aria-label="${this.t('edit')}">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z"/>
                                            </svg>
                                        </button>
                                        <button class="action-btn delete" @click=${() => this._handleDelete(emp.id)} aria-label="${this.t('delete')}">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M6 7h12v2H6V7zm2 3h8l-1 10H9L8 10zm3-6h2l1 1h5v2H5V5h5l1-1z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                              `
                            )}
                            ${
                              currentEmployees.length === 0
                                ? html`
                                    <tr>
                                        <td colspan="10">
                                            <div class="empty-state">${this.t('noRecordsFound')}</div>
                                        </td>
                                    </tr>
                                  `
                                : ''
                            }
                        </tbody>
                    </table>

                    <div class="cards-grid">
                        ${currentEmployees.map(
                          emp => html`
                            <div class="card">
                                <div class="card-grid">
                                    <div>
                                        <div class="field-label">${this.t('firstName')}</div>
                                        <div>${emp.firstName}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('lastName')}</div>
                                        <div>${emp.lastName}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('dateOfEmployment')}</div>
                                        <div>${emp.dateOfEmployment}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('dateOfBirth')}</div>
                                        <div>${emp.dateOfBirth || '-'}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('phoneNumber')}</div>
                                        <div>${emp.phone || '-'}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('email')}</div>
                                        <div>${emp.email}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('department')}</div>
                                        <div>${emp.department}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t('position')}</div>
                                        <div>${emp.position}</div>
                                    </div>
                                </div>
                                <div class="actions">
                                    <button class="btn edit" @click=${() => this._handleEdit(emp.id)}>${this.t('edit')}</button>
                                    <button class="btn primary" @click=${() => this._handleDelete(emp.id)}>${this.t('delete')}</button>
                                </div>
                            </div>
                          `
                        )}
                        ${
                          currentEmployees.length === 0
                            ? html`
                                <div class="empty-state">${this.t('noRecordsFound')}</div>
                              `
                            : ''
                        }
                    </div>
                    
                    <div class="pagination-controls">
                        <button class="pager-btn prev" @click=${() => this._handlePageChange(this.page - 1)} ?disabled=${this.page === 1 || total === 0} aria-label="Previous page">
                            <img class="arrow" src="/assets/icons/right_arrow.svg" alt="" />
                        </button>
                        ${pageItems.map(item => typeof item === 'number'
                            ? html`<button class="pager-num ${this.page === item ? 'active' : ''}" @click=${() => this._handlePageChange(item)} aria-label="Page ${item}">${item}</button>`
                            : html`<span class="ellipsis">…</span>`)}
                        <button class="pager-btn next" @click=${() => this._handlePageChange(this.page + 1)} ?disabled=${this.page === totalPages || total === 0} aria-label="Next page">
                            <img class="arrow" src="/assets/icons/right_arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
            </div>
            <confirm-dialog></confirm-dialog>
        `;
    }
}

customElements.define('employee-list', EmployeeList);


