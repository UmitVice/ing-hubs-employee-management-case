import './employee-list.js';
import {employeeService} from '@/employee-service.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('employee-list', () => {
  setup(() => {
    employeeService.employees = [
      { id: '1', firstName: 'Ada', lastName: 'L', dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01', phone: '1111111111', email: 'a@example.com', department: 'Analytics', position: 'Junior' },
      { id: '2', firstName: 'Grace', lastName: 'H', dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01', phone: '2222222222', email: 'g@example.com', department: 'Tech', position: 'Senior' }
    ];
  });

  test('renders rows in table view', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 2);
  });

  test('switches to cards view', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el._setView('cards');
    await el.updateComplete;
    const cards = el.shadowRoot.querySelectorAll('.cards-grid .card');
    assert.isAtLeast(cards.length, 1);
  });

  test('filters with per-column inputs', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    const firstNameFilter = el.shadowRoot.querySelectorAll('.filters-row .col-filter')[0];
    firstNameFilter.shadowRoot.querySelector('input').value = 'Ada';
    firstNameFilter.shadowRoot.querySelector('input').dispatchEvent(new Event('input'));
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 1);
    const firstNameCell = rows[0].querySelectorAll('td')[1];
    assert.equal(firstNameCell.textContent.trim(), 'Ada');
  });

  test('delete button removes a record after confirm dialog', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    const initial = employeeService.employees.length;
    const delBtn = el.shadowRoot.querySelector('.actions-cell .action-btn.delete');
    delBtn.click();
    await el.updateComplete;
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    const confirmButton = dlg.shadowRoot.querySelector('.confirm');
    confirmButton.click();
    await el.updateComplete;
    assert.equal(employeeService.employees.length, initial - 1);
  });
});


