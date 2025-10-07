import { LitElement, html, css } from 'lit';
import { t as translate } from '@/i18n/i18n.js';
import { employeeService } from '@/employee-service.js';
import { Router } from '@vaadin/router';

export class EmployeeList extends LitElement {
    static properties = {
        employees: { type: Array },
        page: { type: Number },
        pageSize: { type: Number },
        searchTerm: { type: String },
        viewFormat: { type: String }
    };

    static styles = css`
        .employee-list-wrapper {
            max-width: var(--container-max-width);
            margin: var(--spacing-l) auto;
        }

        .list-container {
            padding: var(--spacing-xl);
            background-color: var(--color-surface);
            border-radius: var(--border-radius-base);
            box-shadow: var(--shadow-subtle);
        }

        .list-container[data-view='cards'] {
            background: none;
            box-shadow: none;
            padding: 0;
        }

        .header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-m);
        }
        
        .list-container[data-view="cards"] .data-table,
        .list-container[data-view="table"] .cards-grid {
            display: none;
        }

        .view-toggles {
            display: inline-flex;
            gap: var(--spacing-s);
            align-items: center;
        }
        .icon-btn {
            background: none;
            border: var(--border-width-thin) solid transparent;
            padding: var(--spacing-xs);
            border-radius: var(--border-radius-base);
            cursor: pointer;
            transition: border-color var(--transition-speed-fast), opacity var(--transition-speed-fast);
            opacity: 0.85;
        }
        .icon-btn.active {
            border-color: var(--color-primary);
            opacity: 1;
        }
        .icon-img {
            width: var(--spacing-l);
            height: var(--spacing-l);
            display: block;
        }
        .controls {
            display: none;
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
            border: var(--border-width-thin) solid var(--color-border-strong);
            border-radius: var(--border-radius-base);
            overflow: hidden;
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
            gap: var(--spacing-s);
        }
        .pagination-controls .pager-btn,
        .pagination-controls .pager-num {
            width: var(--pagination-item-size);
            height: var(--pagination-item-size);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            border: var(--border-width-thin) solid var(--color-border);
            background: var(--color-surface);
            cursor: pointer;
            user-select: none;
        }
        .pagination-controls .pager-num.active {
            background: var(--color-primary);
            color: var(--color-surface);
            border-color: transparent;
            font-weight: 600;
        }
        .pagination-controls .pager-btn[disabled] { opacity: var(--opacity-disabled); cursor: not-allowed; }
        .pagination-controls .ellipsis { padding: 0 var(--spacing-s); color: var(--color-text-muted); }
        .pagination-controls .arrow { width: var(--size-icon-sm); height: var(--size-icon-sm); display: block; }
        .pagination-controls .prev .arrow { transform: scaleX(-1); }
        .empty-state {
            height: var(--table-empty-state-height);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        /* Card grid view */
        .cards-grid {
            display: grid;
            gap: var(--spacing-l);
            /* Custom exception: exactly two columns to match design */
            grid-template-columns: repeat(2, 1fr);
        }
        .card {
            background-color: var(--color-surface);
            border-radius: var(--border-radius-base);
            box-shadow: var(--shadow-subtle);
            padding: var(--spacing-l);
            border: var(--border-width-thin) solid var(--color-border-strong);
        }
        .card-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-m);
        }
        .card h3 { margin: var(--spacing-none); }
        .meta {
            color: var(--color-text-dark);
            opacity: 0.8;
            font-size: var(--font-size-small);
        }
        .card .field-label { font-weight: 600; opacity: 0.8; color: var(--color-text-muted); font-size: var(--font-size-2xs); letter-spacing: 0.2px; }
        .card .actions { margin-top: var(--spacing-m); display: inline-flex; gap: var(--spacing-m); }
        .btn { padding: var(--spacing-s) var(--spacing-m); border-radius: var(--border-radius-base); cursor: pointer; border: var(--border-width-thin) solid var(--color-border); background: var(--color-background-light); }
        .btn.primary { background-color: var(--color-primary); color: var(--color-surface); border: none; }
        .btn.edit { background-color: var(--color-accent); color: var(--color-surface); border: none; }
    `;

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
    }

    _setView(view) {
        this.viewFormat = view;
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
        const totalPages = Math.ceil(total / this.pageSize);
        const pageItems = this._buildPageList(totalPages);
        
        return html`
            <div class="employee-list-wrapper">
                <div class="header-row">
                    <h2>${this.t('employeeList')}</h2>
                    <div class="view-toggles">
                        <button class="icon-btn ${this.viewFormat === 'table' ? 'active' : ''}"
                            @click=${() => this._setView('table')} aria-label="Table view">
                            <img class="icon-img" src="/assets/icons/list_icon.png" alt="Table" />
                        </button>
                        <button class="icon-btn ${this.viewFormat === 'cards' ? 'active' : ''}"
                            @click=${() => this._setView('cards')} aria-label="Cards view">
                            <img class="icon-img" src="/assets/icons/square_list_icon.png" alt="Cards" />
                        </button>
                    </div>
                </div>
                <div class="list-container" data-view="${this.viewFormat}">
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
                                <th></th>
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
                            ${currentEmployees.map(
                              emp => html`
                                <tr>
                                    <td><input type="checkbox" aria-label="select" /></td>
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
                              `
                            )}
                            ${
                              currentEmployees.length === 0
                                ? html`
                                    <tr>
                                        <td colspan="8">
                                            <div class="empty-state">${this.t('noRecordsFound')}</div>
                                        </td>
                                    </tr>
                                  `
                                : ''
                            }
                        </tbody>
                    </table>

                    <div class="cards-grid" style="max-height: calc(2 * (18rem + var(--spacing-l))); overflow-y: auto;">
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
        `;
    }
}

customElements.define('employee-list', EmployeeList);


