import './employee-form.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {employeeService} from '@/employee-service.js';

suite('employee-form', () => {
  setup(() => {
    employeeService.employees = [];
  });

  test('renders and validates required fields', async () => {
    /** @type {import('lit').LitElement} */
    const el = await fixture(html`<employee-form></employee-form>`);
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    // should show some errors after invalid submit
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });

  test('submits new employee when valid with confirm dialog', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    // fill inputs
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#phone').value = '905551112233';
    el.shadowRoot.querySelector('#phone').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#email').value = 'ada@example.com';
    el.shadowRoot.querySelector('#email').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#department').value = 'Tech';
    el.shadowRoot.querySelector('#department').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#position').value = 'Senior';
    el.shadowRoot.querySelector('#position').dispatchEvent(new Event('change'));

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    const confirmBtn = dlg.shadowRoot.querySelector('.confirm');
    confirmBtn.click();
    await el.updateComplete;
    assert.equal(employeeService.employees.length, 1);
  });

  test('loads existing employee for edit and updates', async () => {
    // seed one employee
    employeeService.addEmployee({
      firstName: 'Grace', lastName: 'Hopper', dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01', phone: '1111111111', email: 'g@example.com',
      department: 'Analytics', position: 'Junior'
    });
    const id = employeeService.employees[0].id;
    history.pushState(null, '', `/edit/${id}`);
    const el = await fixture(html`<employee-form></employee-form>`);
    // change last name
    el.shadowRoot.querySelector('#lastName').value = 'Updated';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    dlg.shadowRoot.querySelector('.confirm').click();
    await el.updateComplete;
    assert.equal(employeeService.employees[0].lastName, 'Updated');
    history.pushState(null, '', '/');
  });
});


