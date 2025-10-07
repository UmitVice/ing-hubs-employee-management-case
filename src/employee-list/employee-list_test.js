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
});


