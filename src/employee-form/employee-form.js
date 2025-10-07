import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { t as translate } from '../i18n/i18n.js';
import { employeeService } from '../employee-service.js';
import styles from './employee-form.css' assert { type: 'css' };

export class EmployeeForm extends LitElement {
    static properties = {
        employee: { type: Object },
        mode: { type: String },
        errors: { type: Object }
    };

    static styles = [styles];

    t(key, params = []) { return translate(key, params); }

    constructor() {
        super();
        this.mode = 'add';
        this.employee = this._createEmptyEmployee();
        this.errors = {};
    }

    connectedCallback() {
        super.connectedCallback();
        this._onLanguageChanged = () => this.requestUpdate();
        document.addEventListener('language-changed', this._onLanguageChanged);
        const path = window.location.pathname;
        if (path.startsWith('/edit/')) {
            const id = decodeURIComponent(path.split('/').pop() || '');
            const existing = employeeService.getEmployeeById(id);
            if (existing) {
                this.mode = 'edit';
                this.employee = { ...existing };
            }
        }
    }

    disconnectedCallback() {
        document.removeEventListener('language-changed', this._onLanguageChanged);
        super.disconnectedCallback();
    }

    _createEmptyEmployee() {
        return {
            id: null,
            firstName: '',
            lastName: '',
            dateOfEmployment: '',
            dateOfBirth: '',
            phone: '',
            email: '',
            department: '',
            position: ''
        };
    }

    _updateField(key, value) {
        this.employee = { ...this.employee, [key]: value };
        if (this.errors[key]) {
            const { [key]: _removed, ...rest } = this.errors;
            this.errors = rest;
        }
    }

    _validate() {
        const errors = {};
        const { firstName, lastName, dateOfEmployment, email, department, position } = this.employee;
        if (!firstName) errors.firstName = this.t('validationRequired');
        if (!lastName) errors.lastName = this.t('validationRequired');
        if (!dateOfEmployment) errors.dateOfEmployment = this.t('validationRequired');
        if (!email) errors.email = this.t('validationRequired');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = this.t('validationEmail');
        else if (!employeeService.isEmailUnique(email, this.mode === 'edit' ? this.employee.id : null)) {
            errors.email = this.t('validationEmailUnique');
        }
        if (!department) errors.department = this.t('validationRequired');
        if (!position) errors.position = this.t('validationRequired');
        this.errors = errors;
        return Object.keys(errors).length === 0;
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (!this._validate()) return;
        const confirmed = this.mode === 'edit' ?
            confirm(this.t('confirmUpdate')) :
            confirm(this.t('confirmCreate'));
        if (!confirmed) return;

        if (this.mode === 'edit') {
            employeeService.updateEmployee(this.employee);
        } else {
            const { id, ...payload } = this.employee;
            employeeService.addEmployee(payload);
        }
        Router.go('/');
    }

    _handleCancel() {
        Router.go('/');
    }

    render() {
        const title = this.mode === 'edit' ? this.t('editEmployee') : this.t('addNewEmployee');

        return html`
            <div class="form-container">
                <h2>${title}</h2>
                <form @submit=${this._handleSubmit}>
                    <div class="field">
                        <label for="firstName">${this.t('firstName')}</label>
                        <input id="firstName" .value=${this.employee.firstName} @input=${(e) => this._updateField('firstName', e.target.value)}>
                        ${this.errors.firstName ? html`<span class="error-text">${this.errors.firstName}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="lastName">${this.t('lastName')}</label>
                        <input id="lastName" .value=${this.employee.lastName} @input=${(e) => this._updateField('lastName', e.target.value)}>
                        ${this.errors.lastName ? html`<span class="error-text">${this.errors.lastName}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="dateOfEmployment">${this.t('dateOfEmployment')}</label>
                        <input id="dateOfEmployment" type="date" .value=${this.employee.dateOfEmployment} @input=${(e) => this._updateField('dateOfEmployment', e.target.value)}>
                        ${this.errors.dateOfEmployment ? html`<span class="error-text">${this.errors.dateOfEmployment}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="dateOfBirth">${this.t('dateOfBirth')}</label>
                        <input id="dateOfBirth" type="date" .value=${this.employee.dateOfBirth} @input=${(e) => this._updateField('dateOfBirth', e.target.value)}>
                    </div>

                    <div class="field">
                        <label for="phone">${this.t('phoneNumber')}</label>
                        <input id="phone" .value=${this.employee.phone} @input=${(e) => this._updateField('phone', e.target.value)}>
                    </div>

                    <div class="field">
                        <label for="email">${this.t('email')}</label>
                        <input id="email" type="email" .value=${this.employee.email} @input=${(e) => this._updateField('email', e.target.value)}>
                        ${this.errors.email ? html`<span class="error-text">${this.errors.email}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="department">${this.t('department')}</label>
                        <select id="department" .value=${this.employee.department} @change=${(e) => this._updateField('department', e.target.value)}>
                            <option value="">${this.t('departmentPlaceholder')}</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Tech">Tech</option>
                        </select>
                        ${this.errors.department ? html`<span class="error-text">${this.errors.department}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="position">${this.t('position')}</label>
                        <select id="position" .value=${this.employee.position} @change=${(e) => this._updateField('position', e.target.value)}>
                            <option value="">${this.t('positionPlaceholder')}</option>
                            <option value="Junior">Junior</option>
                            <option value="Medior">Medior</option>
                            <option value="Senior">Senior</option>
                        </select>
                        ${this.errors.position ? html`<span class="error-text">${this.errors.position}</span>` : ''}
                    </div>

                    <div class="actions">
                        <button type="submit" class="btn-primary">${this.t('save')}</button>
                        <button type="button" class="btn-secondary" @click=${this._handleCancel}>${this.t('cancel')}</button>
                    </div>
                </form>
            </div>
        `;
    }
}

customElements.define('employee-form', EmployeeForm);


