import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { t as translate } from '../i18n/i18n.js';
import { employeeService } from '../employee-service.js';
import { adoptStylesheets } from '../utils/style-loader.js';

export class EmployeeForm extends LitElement {
    static properties = {
        employee: { type: Object },
        mode: { type: String },
        errors: { type: Object }
    };

    static styles = [];

    t(key, params = []) { return translate(key, params); }

    constructor() {
        super();
        this.mode = 'add';
        this.employee = this._createEmptyEmployee();
        this.errors = {};
    }

    async connectedCallback() {
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
        await adoptStylesheets(this.shadowRoot, [new URL('./employee-form.css', import.meta.url)]);
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

    _sanitizeLetters(text) {
        return (text || '').replace(/[^\p{L}]/gu, '');
    }

    _sanitizeDigits(text) {
        return (text || '').replace(/\D/g, '');
    }

    _handleNameInput(field, e) {
        const sanitized = this._sanitizeLetters(e.target.value);
        this._updateField(field, sanitized);
    }

    _handleNameKeydown(e) {
        if (e.key && e.key.length === 1 && !/\p{L}/u.test(e.key)) {
            e.preventDefault();
        }
    }

    _handleNamePaste(field, e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
        const sanitized = this._sanitizeLetters(text);
        const value = e.target.value || '';
        const start = e.target.selectionStart ?? value.length;
        const end = e.target.selectionEnd ?? value.length;
        const next = value.slice(0, start) + sanitized + value.slice(end);
        e.target.value = next;
        this._updateField(field, next);
    }

    _handlePhoneInput(e) {
        const digitsOnly = this._sanitizeDigits(e.target.value);
        this._updateField('phone', digitsOnly);
    }

    _handlePhoneKeydown(e) {
        const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Enter'];
        if (allowed.includes(e.key)) return;
        if (e.key && e.key.length === 1 && !/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }

    _handlePhonePaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
        const digits = this._sanitizeDigits(text);
        const current = this.employee.phone || '';
        const value = e.target.value || '';
        const start = e.target.selectionStart ?? value.length;
        const end = e.target.selectionEnd ?? value.length;
        const prefix = (current.slice(0, start)).replace(/\D/g,'');
        const suffix = (current.slice(end)).replace(/\D/g,'');
        const nextDigits = (current.slice(0, start).replace(/\D/g,'') + digits + current.slice(end).replace(/\D/g,''));
        this._updateField('phone', nextDigits);
    }

    _formatPhoneDisplay(digits) {
        if (!digits) return '';
        const cc = digits.slice(0, 3);
        const rest = digits.slice(3);
        const groups = [];
        let remaining = rest;
        const sizes = [3, 3, 2, 2, 2];
        for (const size of sizes) {
            if (!remaining) break;
            groups.push(remaining.slice(0, size));
            remaining = remaining.slice(size);
        }
        if (remaining) groups.push(remaining);
        const ccPart = cc ? `(+${cc})` : '+';
        return `${ccPart}${groups.length ? ' ' + groups.join(' ') : ''}`.trim();
    }

    _validate() {
        const errors = {};
        const { firstName, lastName, dateOfEmployment, dateOfBirth, email, phone, department, position } = this.employee;
        if (!firstName) errors.firstName = this.t('validationRequired');
        else if (!/^\p{L}+(?:[\s'-]\p{L}+)*$/u.test(firstName)) errors.firstName = this.t('validationLettersOnly');
        if (!lastName) errors.lastName = this.t('validationRequired');
        else if (!/^\p{L}+(?:[\s'-]\p{L}+)*$/u.test(lastName)) errors.lastName = this.t('validationLettersOnly');
        if (!dateOfEmployment) errors.dateOfEmployment = this.t('validationRequired');
        if (!dateOfBirth) errors.dateOfBirth = this.t('validationRequired');
        if (!email) errors.email = this.t('validationRequired');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = this.t('validationEmail');
        else if (!employeeService.isEmailUnique(email, this.mode === 'edit' ? this.employee.id : null)) {
            errors.email = this.t('validationEmailUnique');
        }
        if (!phone) errors.phone = this.t('validationRequired');
        else if (!/^\d{10,15}$/.test(phone)) errors.phone = this.t('validationPhone');
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
                        <input id="firstName" .value=${this.employee.firstName} @keydown=${this._handleNameKeydown} @paste=${(e) => this._handleNamePaste('firstName', e)} @input=${(e) => this._handleNameInput('firstName', e)}>
                        ${this.errors.firstName ? html`<span class="error-text">${this.errors.firstName}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="lastName">${this.t('lastName')}</label>
                        <input id="lastName" .value=${this.employee.lastName} @keydown=${this._handleNameKeydown} @paste=${(e) => this._handleNamePaste('lastName', e)} @input=${(e) => this._handleNameInput('lastName', e)}>
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
                        ${this.errors.dateOfBirth ? html`<span class="error-text">${this.errors.dateOfBirth}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="phone">${this.t('phoneNumber')}</label>
                        <input id="phone" inputmode="numeric" .value=${this._formatPhoneDisplay(this.employee.phone)} @keydown=${this._handlePhoneKeydown} @paste=${this._handlePhonePaste} @input=${this._handlePhoneInput}>
                        ${this.errors.phone ? html`<span class="error-text">${this.errors.phone}</span>` : ''}
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


