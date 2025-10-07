import { LitElement, html } from 'lit';
import { t as translate } from '../i18n/i18n.js';
import { employeeService } from '../employee-service.js';
import { Router } from '@vaadin/router';
import { adoptStylesheets } from '../utils/style-loader.js';

export class EmployeeList extends LitElement {
    static properties = {
        employees: { type: Array },
        page: { type: Number },
        pageSize: { type: Number },
        searchTerm: { type: String },
        viewFormat: { type: String }
    };

    static styles = [];

    // Lightweight bridge to the global translator
    t(key, params = []) { return translate(key, params); }

    constructor() {
        super();
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
        await adoptStylesheets(this.shadowRoot, [new URL('./employee-list.css', import.meta.url)]);
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
                                <td colspan="7">
                                    <div class="empty-state">${this.t('noRecordsFound')}</div>
                                </td>
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


