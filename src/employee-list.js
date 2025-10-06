import { LitElement, html, css } from 'lit';
import { LocalizeMixin, defaultTranslations } from './mixins/localize-mixin.js';
import { employeeService } from './employee-service.js';
import { Router } from '@vaadin/router';

export class EmployeeList extends LocalizeMixin(LitElement) {
    static properties = {
        employees: { type: Array },
        page: { type: Number },
        pageSize: { type: Number },
        searchTerm: { type: String },
        viewFormat: { type: String }
    };

    static translations = defaultTranslations;

    constructor() {
        super();
        this.employees = [];
        this.page = 1;
        this.pageSize = 10;
        this.searchTerm = '';
        this.viewFormat = 'table';

        this._employeeDataChanged = this._employeeDataChanged.bind(this);
        employeeService.addEventListener('employees-changed', this._employeeDataChanged);
    }
    
    disconnectedCallback() {
        employeeService.removeEventListener('employees-changed', this._employeeDataChanged);
        super.disconnectedCallback();
    }

    _employeeDataChanged(e) {
        this.employees = e.detail.employees;
        this.page = 1; 
    }

    connectedCallback() {
        super.connectedCallback();
        // Load initial data on connect
        this.employees = employeeService.employees; 
    }

    _handleEdit(id) {
        Router.go(`/edit/${id}`);
    }

    _handleDelete(id) {
        if (confirm(this.t('confirmDelete'))) {
             employeeService.deleteEmployee(id);
        }
    }
    
    _handleSearch(e) {
        this.searchTerm = e.target.value;
        this.page = 1;
    }
    
    _handlePageChange(newPage) {
        const maxPage = Math.ceil(this.employees.length / this.pageSize);
        if (newPage >= 1 && newPage <= maxPage) {
            this.page = newPage;
        }
    }

    static get styles() {
        return css`
            .list-container {
                max-width: var(--container-max-width);
                margin: var(--spacing-l) auto;
                padding: var(--spacing-xl);
                background-color: var(--color-surface);
                border-radius: var(--border-radius-base);
                box-shadow: var(--shadow-subtle);
            }
            .controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-m);
            }
            .btn-add {
                background-color: var(--color-primary);
                color: var(--color-surface);
                border: none;
                padding: var(--spacing-s) var(--spacing-m);
                border-radius: var(--border-radius-base);
                cursor: pointer;
            }
            .search-input {
                padding: var(--spacing-s);
                border: var(--border-width-thin) solid var(--color-border);
                border-radius: var(--border-radius-base);
                width: var(--input-width-md);
            }
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: var(--spacing-m);
            }
            .data-table th, .data-table td {
                padding: var(--spacing-s) var(--spacing-m);
                border-bottom: var(--border-width-thin) solid var(--color-border);
                text-align: left;
                font-size: var(--font-size-base);
            }
            .data-table th {
                background-color: var(--color-background-light);
                color: var(--color-text-dark);
                font-weight: bold;
                text-transform: uppercase;
            }
            .actions-cell button {
                padding: var(--spacing-xs) var(--spacing-s);
                margin-left: var(--spacing-s);
                cursor: pointer;
                border-radius: var(--border-radius-base);
                border: var(--border-width-thin) solid var(--color-border);
                background-color: transparent;
                transition: background-color var(--transition-speed-fast);
            }
            .actions-cell button:hover {
                 background-color: var(--color-border);
            }
            .pagination-controls {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: var(--spacing-l);
                gap: var(--spacing-m);
            }
            .pagination-controls button {
                padding: var(--spacing-s);
                border: var(--border-width-thin) solid var(--color-border);
                background-color: var(--color-surface);
                cursor: pointer;
            }
            .pagination-controls button:disabled {
                opacity: var(--opacity-disabled);
                cursor: not-allowed;
            }
        `;
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
        
        // Pagination logic
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        return {
            total: filteredEmployees.length,
            records: filteredEmployees.slice(startIndex, endIndex)
        };
    }

    render() {
        const { total, records: currentEmployees } = this._getCurrentPageEmployees();
        const totalPages = Math.ceil(total / this.pageSize);
        
        return html`
            <div class="list-container">
                <h2>${this.t('employeeList')}</h2>
                
                <div class="controls">
                    <input 
                        type="text" 
                        placeholder=${this.t('searchPlaceholder')} 
                        .value=${this.searchTerm}
                        @input=${this._handleSearch}
                        class="search-input"
                    >
                    <button class="btn-add" @click=${() => Router.go('/add')}>${this.t('add')}</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>${this.t('firstName')}</th>
                            <th>${this.t('lastName')}</th>
                            <th>${this.t('dateOfEmployment')}</th>
                            <th>${this.t('email')}</th>
                            <th>${this.t('department')}</th>
                            <th>${this.t('position')}</th>
                            <th>${this.t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentEmployees.map(emp => html`
                            <tr>
                                <td>${emp.firstName}</td>
                                <td>${emp.lastName}</td>
                                <td>${emp.dateOfEmployment}</td>
                                <td>${emp.email}</td>
                                <td>${emp.department}</td>
                                <td>${emp.position}</td>
                                <td class="actions-cell">
                                    <button @click=${() => this._handleEdit(emp.id)}>${this.t('edit')}</button>
                                    <button @click=${() => this._handleDelete(emp.id)}>${this.t('delete')}</button>
                                </td>
                            </tr>
                        `)}
                        ${currentEmployees.length === 0 ? html`
                            <tr>
                                <td colspan="7" style="text-align:center;">${this.t('noRecordsFound')}</td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
                
                <div class="pagination-controls">
                    <button 
                        @click=${() => this._handlePageChange(this.page - 1)} 
                        ?disabled=${this.page === 1}
                    >
                        ${this.t('previous')}
                    </button>
                    <span>${this.t('page')} ${this.page} ${this.t('of')} ${totalPages}</span>
                    <button 
                        @click=${() => this._handlePageChange(this.page + 1)} 
                        ?disabled=${this.page === totalPages || total === 0}
                    >
                        ${this.t('next')}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('employee-list', EmployeeList);