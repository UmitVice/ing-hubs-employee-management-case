import { LitElement, html, css } from 'lit';
import { LocalizeMixin, defaultTranslations } from './mixins/localize-mixin.js';
import { employeeService } from './employee-service.js';
import { Router } from '@vaadin/router';

export class EmployeeList extends LocalizeMixin(LitElement) {
    static properties = {
        employees: { type: Array }
    };

    static translations = defaultTranslations;

    constructor() {
        super();
        this.employees = [];
        this._employeeDataChanged = this._employeeDataChanged.bind(this);
        employeeService.addEventListener('employees-changed', this._employeeDataChanged);
    }
    
    disconnectedCallback() {
        employeeService.removeEventListener('employees-changed', this._employeeDataChanged);
        super.disconnectedCallback();
    }

    _employeeDataChanged(e) {
        this.employees = e.detail.employees;
    }

    connectedCallback() {
        super.connectedCallback();
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
                justify-content: flex-end;
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
        `;
    }

    render() {
        const currentEmployees = this.employees;
        
        return html`
            <div class="list-container">
                <h2>${this.t('employeeList')}</h2>
                
                <div class="controls">
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
            </div>
        `;
    }
}

customElements.define('employee-list', EmployeeList);