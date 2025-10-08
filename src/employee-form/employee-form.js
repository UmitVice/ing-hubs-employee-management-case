// @ts-check
import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { withBase, stripBase } from '@/utils/base-path.js';
import { t as translate } from '@/i18n/i18n.js';
import { employeeService } from '@/employee-service.js';
import { adoptStylesheets } from '@/utils/style-loader.js';
import { extractLocalDigits, formatPhoneTR } from '@/utils/phone.js';
import { parseDDMMYYYYToISO, formatDigitsToDDMMYYYY } from '@/utils/date.js';
import '@/components/confirm-dialog/confirm-dialog.js';
import '@/components/page-container/page-container.js';
import '@/components/app-button/app-button.js';
/** @typedef {import('@/types.js').Employee} Employee */

export class EmployeeForm extends LitElement {
    static properties = {
        employee: { type: Object },
        mode: { type: String },
        errors: { type: Object },
        _countryCodeLength: { type: Number, state: true },
        _isLoading: { type: Boolean, state: true },
        _originalDisplayName: { type: String, state: true }
    };

    async firstUpdated() {
        // Prevent FOUC: hide until styles are ready
        this.style.visibility = 'hidden';
        await adoptStylesheets(this.shadowRoot, [new URL('./employee-form.css', import.meta.url)]);
        this.style.visibility = 'visible';
        // Sync form inputs with employee data
        this._syncFormWithEmployee();
    }

    t(key, params = []) { return translate(key, params); }

    constructor() {
        super();
        this.mode = 'add';
        /** @type {Employee} */
        this.employee = this._createEmptyEmployee();
        this.errors = {};
        this.NAME_MAX = 50;
        this.EMAIL_MAX = 254;
        this.PHONE_MAX = 10;
        this._countryCodeLength = 0;
        this._isLoading = true; // Start in loading state
        this._originalDisplayName = '';
        this.requestUpdate();
    }

    async connectedCallback() {
        super.connectedCallback();
        this._onLanguageChanged = () => this.requestUpdate();
        document.addEventListener('language-changed', this._onLanguageChanged);
        
        // Add loading state right away so initial render shows loading UI
        this._isLoading = true;
        this.requestUpdate();
        
        try {
            const path = stripBase(window.location.pathname);
            if (path.startsWith('/edit/')) {
                const id = decodeURIComponent(path.split('/').pop() || '');
                
                // Wait a bit for employeeService to be ready
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const existing = employeeService.getEmployeeById(id);
                if (existing) {
                    this.mode = 'edit';
                    this.employee = { ...existing };
                    this._originalDisplayName = `${existing.firstName || ''} ${existing.lastName || ''}`.trim();
                } else {
                    // Employee not found, redirect to home page
                    console.warn(`Employee with ID ${id} not found, redirecting to home`);
                    Router.go(withBase('/'));
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading employee data:', error);
            Router.go(withBase('/'));
            return;
        } finally {
            // Only set loading to false if we're not in edit mode or if employee was found
            if (this.mode !== 'edit' || this.employee.id) {
                this._isLoading = false;
                this.requestUpdate();
            }
        }
    }

    disconnectedCallback() {
        document.removeEventListener('language-changed', this._onLanguageChanged);
        super.disconnectedCallback();
    }

    /** @returns {Employee} */
    _createEmptyEmployee() {
        return /** @type {Employee} */ ({
            id: null,
            firstName: '',
            lastName: '',
            dateOfEmployment: '',
            dateOfBirth: '',
            phone: '',
            email: '',
            department: /** @type {any} */(''),
            position: /** @type {any} */('')
        });
    }

    _updateField(key, value) {
        this.employee = { ...this.employee, [key]: value };
        if (this.errors[key]) {
            const { [key]: _removed, ...rest } = this.errors;
            this.errors = rest;
        }
    }

    _sanitizeLetters(text) {
        return (text || '').replace(/[^\p{L}\s]/gu, '');
    }

    _sanitizeDigits(text) {
        return (text || '').replace(/\D/g, '');
    }

    _handleNameInput(field, e) {
        let sanitized = this._sanitizeLetters(e.target.value);
        if (sanitized.length > this.NAME_MAX) {
            sanitized = sanitized.slice(0, this.NAME_MAX);
        }
        this._updateField(field, sanitized);
        if (sanitized.length >= this.NAME_MAX) {
            this.errors = { ...this.errors, [field]: this.t('validationMaxLength', [this.NAME_MAX]) };
        } else if (this.errors[field] && /\d+/.test(this.errors[field])) {
            const { [field]: _removed, ...rest } = this.errors; this.errors = rest;
        }
    }

    _handleNameKeydown(e) {
        const control = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Enter'].includes(e.key);
        if (control) return;
        if (e.key === ' ') {
            // allow space but enforce max length
            const value = e.target.value || '';
            if (value.length >= this.NAME_MAX) { e.preventDefault(); return; }
            return;
        }
        if (e.key && e.key.length === 1 && !/\p{L}/u.test(e.key)) {
            e.preventDefault();
            return;
        }
        const value = e.target.value || '';
        if (value.length >= this.NAME_MAX) { e.preventDefault(); }
    }

    _handleNamePaste(field, e) {
        e.preventDefault();
        const text = (e.clipboardData || /** @type {any} */(window).clipboardData)?.getData('text') || '';
        let sanitized = this._sanitizeLetters(text);
        const currentValue = e.target.value || '';
        const start = e.target.selectionStart ?? currentValue.length;
        const end = e.target.selectionEnd ?? currentValue.length;
        const next = (currentValue.slice(0, start) + sanitized + currentValue.slice(end)).slice(0, this.NAME_MAX);
        e.target.value = next;
        this._updateField(field, next);
        if (next.length >= this.NAME_MAX) {
            this.errors = { ...this.errors, [field]: this.t('validationMaxLength', [this.NAME_MAX]) };
        }
    }

    _handlePhoneInput(e) {
        const digitsOnly = extractLocalDigits(e.target.value);

        if (this._countryCodeLength > 0 && digitsOnly.length < this._countryCodeLength) {
            this._countryCodeLength = 0;
        }

        this._updateField('phone', digitsOnly);
    }

    _handlePhoneBlur() {
        const digitsLen = (this.employee.phone || '').length;
        if (digitsLen === this.PHONE_MAX && this.errors.phone) {
            const { phone, ...rest } = this.errors; this.errors = rest;
        }
    }

    _handleDateChange(field, e) {
        const raw = (e.target.value || '').trim();
        if (!raw) {
            this._updateField(field, '');
            return;
        }
        // Support ISO yyyy-mm-dd directly (as used in tests)
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            this._updateField(field, raw);
            return;
        }
        // Support dd/mm/yyyy
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const iso = parseDDMMYYYYToISO(raw);
            if (iso) {
                this._updateField(field, iso);
            }
            return;
        }
        // Fallback: try best-effort parsing
        const iso = parseDDMMYYYYToISO(raw);
        if (iso) this._updateField(field, iso);
    }

    _handlePhoneKeydown(e) {
        if (e.key === ' ') {
            e.preventDefault();
            const digits = this.employee.phone || '';
            if (digits.length > 0 && this._countryCodeLength === 0) {
                this._countryCodeLength = digits.length;
            }
            return;
        }
        const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Enter'];
        if (allowed.includes(e.key)) return;
        if (e.key && e.key.length === 1 && !/[0-9]/.test(e.key)) {
            e.preventDefault();
            return;
        }
        const digitsLen = (this.employee.phone || '').length;
        if (digitsLen >= this.PHONE_MAX) {
            e.preventDefault();
            this.errors = { ...this.errors, phone: this.t('validationMaxDigits', [this.PHONE_MAX]) };
        }
    }

    _handlePhonePaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || /** @type {any} */(window).clipboardData)?.getData('text') || '';
        const pasted = extractLocalDigits(text);
        const current = this.employee.phone || '';
        const nextDigits = (current + pasted).slice(0, this.PHONE_MAX);
        this._updateField('phone', nextDigits);
        if (nextDigits.length >= this.PHONE_MAX) {
            this.errors = { ...this.errors, phone: this.t('validationMaxDigits', [this.PHONE_MAX]) };
        }
    }

    _formatPhoneDisplay(digits) {
        return formatPhoneTR(digits);
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
        
        // Validate date relationship
        if (dateOfEmployment && dateOfBirth) {
            const employmentDate = new Date(dateOfEmployment);
            const birthDate = new Date(dateOfBirth);
            if (birthDate >= employmentDate) {
                errors.dateOfBirth = this.t('validationDateBeforeEmployment');
            }
        }
        if (!email) errors.email = this.t('validationRequired');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = this.t('validationEmail');
        else if (!employeeService.isEmailUnique(email, this.mode === 'edit' ? this.employee.id : null)) {
            errors.email = this.t('validationEmailUnique');
        }
        if (!phone) errors.phone = this.t('validationRequired');
        else if (!/^\d{10}$/.test(phone)) errors.phone = this.t('validationPhone');
        if (!department) errors.department = this.t('validationRequired');
        if (!position) errors.position = this.t('validationRequired');
        this.errors = errors;
        return Object.keys(errors).length === 0;
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (!this._validate()) return;
        const dlg = /** @type {import('@/components/confirm-dialog/confirm-dialog.js').ConfirmDialog} */(this.shadowRoot.querySelector('confirm-dialog'));
        const title = this.mode === 'edit' ? this.t('editEmployee') : this.t('addNewEmployee');
        const message = this.mode === 'edit' ? this.t('confirmUpdate') : this.t('confirmCreate');
        dlg.openWith({ title, message, confirmText: this.t('proceed'), cancelText: this.t('cancel'), variant: 'default' });
        // Ensure dialog is open
        dlg.open = true;
        const onConfirm = () => {
            if (this.mode === 'edit') {
                employeeService.updateEmployee(this.employee);
            } else {
                const { id, ...payload } = this.employee;
                employeeService.addEmployee(payload);
                // Clear form after successful submission
                this.employee = this._createEmptyEmployee();
                this.errors = {};
                this.requestUpdate();
                // Sync form inputs after clearing
                setTimeout(() => {
                    this._syncFormWithEmployee();
                    // Also reset form elements directly
                    const form = this.shadowRoot.querySelector('form');
                    if (form) {
                        form.reset();
                    }
                }, 0);
            }
            dlg.removeEventListener('confirm', onConfirm);
            // Navigate after UI is updated to avoid races in tests
            setTimeout(() => Router.go(withBase('/')), 0);
        };
        dlg.addEventListener('confirm', onConfirm);
    }

    _handleCancel() {
        Router.go(withBase('/'));
    }

    

    _syncFormWithEmployee() {
        // Sync form inputs with employee data
        const inputs = this.shadowRoot.querySelectorAll('input, select');
        inputs.forEach(input => {
            const field = input.id;
            if (field && this.employee[field] !== undefined && 'value' in input) {
                input.value = this.employee[field] || '';
            }
        });
        
        // Force update to ensure UI reflects the changes
        this.requestUpdate();
    }

    _handleSaveClick() {
        const form = this.shadowRoot.querySelector('form');
        // Prefer requestSubmit when available to trigger the native submit
        if (form && typeof form.requestSubmit === 'function') {
            form.requestSubmit();
        } else if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true, composed: true }));
        }
    }

    render() {
        if (this._isLoading) {
            const loadingText = this.t('loading');
            return html`
                <page-container title="${loadingText && !String(loadingText).startsWith('MISSING_KEY') ? loadingText : 'Loading'}">
                    <div style="text-align: center; padding: 2rem;">
                        <p>${loadingText && !String(loadingText).startsWith('MISSING_KEY') ? loadingText : 'Loading'}...</p>
                    </div>
                </page-container>
            `;
        }

        const title = this.mode === 'edit' ? this.t('editEmployee') : this.t('addNewEmployee');

        return html`
            <page-container title="${title}">
                ${this.mode === 'edit'
                    ? html`<p class="subtitle">${this.t('editingUserLabel', [this._originalDisplayName])}</p>`
                    : ''
                }
                <form id="employeeForm" @submit=${this._handleSubmit} style="max-width:900px;margin-left:auto;margin-right:auto;">
                    <div class="field">
                        <label for="firstName">${this.t('firstName')}</label>
                        <input id="firstName" maxlength="50" .value=${this.employee.firstName} @keydown=${this._handleNameKeydown} @paste=${(e) => this._handleNamePaste('firstName', e)} @input=${(e) => this._handleNameInput('firstName', e)}>
                        ${this.errors.firstName ? html`<span class="error-text">${this.errors.firstName}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="lastName">${this.t('lastName')}</label>
                        <input id="lastName" maxlength="50" .value=${this.employee.lastName} @keydown=${this._handleNameKeydown} @paste=${(e) => this._handleNamePaste('lastName', e)} @input=${(e) => this._handleNameInput('lastName', e)}>
                        ${this.errors.lastName ? html`<span class="error-text">${this.errors.lastName}</span>` : ''}
                    </div>

                    <div class="field date-field">
                        <label for="dateOfEmployment">${this.t('dateOfEmployment')}</label>
                        <div class="date-input-wrapper">
                            <input
                                id="dateOfEmployment"
                                type="text"
                                inputmode="numeric"
                                maxlength="10"
                                .value=${formatDigitsToDDMMYYYY(this.employee.dateOfEmployment ? this.employee.dateOfEmployment.replace(/\D/g, '').slice(6,8) + this.employee.dateOfEmployment.replace(/\D/g, '').slice(4,6) + this.employee.dateOfEmployment.replace(/\D/g, '').slice(0,4) : '')}
                                placeholder="dd/mm/yyyy"
                                @change=${(e) => this._handleDateChange('dateOfEmployment', e)}
                                @input=${(e) => {
                                    const formatted = formatDigitsToDDMMYYYY(e.target.value);
                                    e.target.value = formatted;
                                    this._handleDateChange('dateOfEmployment', e);
                                }}
                            >
                            <button class="date-icon" @click=${() => { const el = /** @type {any} */(this.shadowRoot.querySelector('#dateOfEmployment')); if (el && typeof el.showPicker === 'function') el.showPicker(); }} aria-label="Open date picker">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="currentColor" d="M7 10h5v5H7zM6 2h2v2h8V2h2v2h2v16H4V4h2V2zm0 6h12V6H6v2z"/>
                                </svg>
                            </button>
                        </div>
                        ${this.errors.dateOfEmployment ? html`<span class="error-text">${this.errors.dateOfEmployment}</span>` : ''}
                    </div>

                    <div class="field date-field">
                        <label for="dateOfBirth">${this.t('dateOfBirth')}</label>
                        <div class="date-input-wrapper">
                            <input
                                id="dateOfBirth"
                                type="text"
                                inputmode="numeric"
                                maxlength="10"
                                .value=${formatDigitsToDDMMYYYY(this.employee.dateOfBirth ? this.employee.dateOfBirth.replace(/\D/g, '').slice(6,8) + this.employee.dateOfBirth.replace(/\D/g, '').slice(4,6) + this.employee.dateOfBirth.replace(/\D/g, '').slice(0,4) : '')}
                                placeholder="dd/mm/yyyy"
                                @change=${(e) => this._handleDateChange('dateOfBirth', e)}
                                @input=${(e) => {
                                    const formatted = formatDigitsToDDMMYYYY(e.target.value);
                                    e.target.value = formatted;
                                    this._handleDateChange('dateOfBirth', e);
                                }}
                            >
                            <button class="date-icon" @click=${() => { const el = /** @type {any} */(this.shadowRoot.querySelector('#dateOfBirth')); if (el && typeof el.showPicker === 'function') el.showPicker(); }} aria-label="Open date picker">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="currentColor" d="M7 10h5v5H7zM6 2h2v2h8V2h2v2h2v16H4V4h2V2zm0 6h12V6H6v2z"/>
                                </svg>
                            </button>
                        </div>
                        ${this.errors.dateOfBirth ? html`<span class="error-text">${this.errors.dateOfBirth}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="phone">${this.t('phoneNumber')}</label>
                        <input id="phone" inputmode="numeric" .value=${this._formatPhoneDisplay(this.employee.phone)} @keydown=${this._handlePhoneKeydown} @paste=${this._handlePhonePaste} @input=${this._handlePhoneInput} @blur=${this._handlePhoneBlur}>
                        ${this.errors.phone ? html`<span class="error-text">${this.errors.phone}</span>` : ''}
                    </div>

                    <div class="field">
                        <label for="email">${this.t('email')}</label>
                        <input id="email" type="email" maxlength="254" .value=${this.employee.email} @input=${(e) => {
                            let val = e.target.value || '';
                            if (val.length > this.EMAIL_MAX) val = val.slice(0, this.EMAIL_MAX);
                            this._updateField('email', val);
                            if (val.length >= this.EMAIL_MAX) {
                                this.errors = { ...this.errors, email: this.t('validationMaxLength', [this.EMAIL_MAX]) };
                            } else if (this.errors.email && /\d+/.test(this.errors.email)) {
                                const { email, ...rest } = this.errors; this.errors = rest;
                            }
                        }}>
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
                        <app-button variant="primary" type="button" @click=${this._handleSaveClick}>${this.t('save')}</app-button>
                        <app-button variant="outline" @click=${this._handleCancel}>${this.t('cancel')}</app-button>
                    </div>
                </form>
            </page-container>
            <confirm-dialog></confirm-dialog>
        `;
    }
}

customElements.define('employee-form', EmployeeForm);


