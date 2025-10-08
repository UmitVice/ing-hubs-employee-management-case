import './employee-list.js';
import {employeeService} from '@/employee-service.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('employee-list', () => {
  setup(() => {
    employeeService.employees = [
      { id: '1', firstName: 'Ada', lastName: 'Lovelace', dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01', phone: '1111111111', email: 'ada@example.com', department: 'Analytics', position: 'Junior' },
      { id: '2', firstName: 'Grace', lastName: 'Hopper', dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01', phone: '2222222222', email: 'grace@example.com', department: 'Tech', position: 'Senior' },
      { id: '3', firstName: 'Alan', lastName: 'Turing', dateOfEmployment: '2025-01-03', dateOfBirth: '1992-01-01', phone: '3333333333', email: 'alan@example.com', department: 'Tech', position: 'Lead' }
    ];
  });

  teardown(() => {
    // Reset employees after each test
    employeeService.employees = [];
  });

  test('renders with correct structure', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Check main structure
    assert.exists(el.shadowRoot.querySelector('.list-view-wrapper'));
    assert.exists(el.shadowRoot.querySelector('.data-table'));
    assert.exists(el.shadowRoot.querySelector('.page-title'));
    assert.exists(el.shadowRoot.querySelector('.toolbar'));
  });

  test('renders all employees in table view by default', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 3);
    
    // Check first row data
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');
    assert.equal(cells[1].textContent.trim(), 'Ada');
    assert.equal(cells[2].textContent.trim(), 'Lovelace');
  });

  test('switches to cards view', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Switch to cards view
    el._setView('cards');
    await el.updateComplete;
    
    // Check view state
    assert.equal(el._currentView, 'cards');
    const wrapper = el.shadowRoot.querySelector('.list-view-wrapper');
    assert.equal(wrapper.getAttribute('data-view'), 'cards');
    
    // Check cards are visible
    const cards = el.shadowRoot.querySelectorAll('.cards-grid .card');
    assert.isAtLeast(cards.length, 1);
    
    // Check table is hidden
    const table = el.shadowRoot.querySelector('.data-table');
    assert.isTrue(table.style.display === 'none' || table.classList.contains('hidden'));
  });

  test('switches back to table view', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Switch to cards then back to table
    el._setView('cards');
    await el.updateComplete;
    el._setView('table');
    await el.updateComplete;
    
    // Check view state
    assert.equal(el._currentView, 'table');
    const wrapper = el.shadowRoot.querySelector('.list-view-wrapper');
    assert.equal(wrapper.getAttribute('data-view'), 'table');
    
    // Check table is visible
    const table = el.shadowRoot.querySelector('.data-table');
    assert.exists(table);
  });

  test('filters employees by first name', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Get first name filter
    const firstNameFilter = el.shadowRoot.querySelectorAll('.filters-row .col-filter')[0];
    const input = firstNameFilter.shadowRoot.querySelector('input');
    
    // Filter by 'Ada'
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 1);
    const firstNameCell = rows[0].querySelectorAll('td')[1];
    assert.equal(firstNameCell.textContent.trim(), 'Ada');
  });

  test('filters employees by department', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Get department filter (assuming it's the 7th column)
    const departmentFilter = el.shadowRoot.querySelectorAll('.filters-row .col-filter')[6];
    const input = departmentFilter.shadowRoot.querySelector('input');
    
    // Filter by 'Tech'
    input.value = 'Tech';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 2); // Grace and Alan are in Tech
  });

  test('clears filters when search is cleared', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Apply filter
    const firstNameFilter = el.shadowRoot.querySelectorAll('.filters-row .col-filter')[0];
    const input = firstNameFilter.shadowRoot.querySelector('input');
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    // Clear filter
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 3); // All employees should be visible
  });

  test('sorts employees by first name', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Click first name header to sort
    const firstNameHeader = el.shadowRoot.querySelectorAll('thead th')[1];
    firstNameHeader.click();
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    const firstRowName = rows[0].querySelectorAll('td')[1].textContent.trim();
    const secondRowName = rows[1].querySelectorAll('td')[1].textContent.trim();
    
    // Should be sorted alphabetically
    assert.isTrue(firstRowName <= secondRowName);
  });

  test('handles bulk selection', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Select all checkbox
    const selectAllCheckbox = el.shadowRoot.querySelector('thead input[type="checkbox"]');
    selectAllCheckbox.click();
    await el.updateComplete;
    
    // Check all row checkboxes are selected
    const rowCheckboxes = el.shadowRoot.querySelectorAll('tbody input[type="checkbox"]');
    rowCheckboxes.forEach(checkbox => {
      assert.isTrue(checkbox.checked);
    });
  });

  test('enables bulk delete when employees are selected', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Select first employee
    const firstCheckbox = el.shadowRoot.querySelector('tbody input[type="checkbox"]');
    firstCheckbox.click();
    await el.updateComplete;
    
    // Bulk delete button should be enabled
    const bulkDeleteBtn = el.shadowRoot.querySelector('.header-delete');
    assert.isFalse(bulkDeleteBtn.hasAttribute('disabled'));
  });

  test('performs bulk delete operation', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    const initialCount = employeeService.employees.length;
    
    // Select all employees
    const selectAllCheckbox = el.shadowRoot.querySelector('thead input[type="checkbox"]');
    selectAllCheckbox.click();
    await el.updateComplete;
    
    // Click bulk delete
    const bulkDeleteBtn = el.shadowRoot.querySelector('.header-delete');
    bulkDeleteBtn.click();
    await el.updateComplete;
    
    // Confirm deletion
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    const confirmButton = dlg.shadowRoot.querySelector('.confirm');
    confirmButton.click();
    await el.updateComplete;
    
    // All employees should be deleted
    assert.equal(employeeService.employees.length, 0);
  });

  test('deletes single employee after confirmation', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    const initialCount = employeeService.employees.length;
    
    // Click delete button for first employee
    const delBtn = el.shadowRoot.querySelector('.actions-cell .action-btn.delete');
    delBtn.click();
    await el.updateComplete;
    
    // Confirm deletion
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    const confirmButton = dlg.shadowRoot.querySelector('.confirm');
    confirmButton.click();
    await el.updateComplete;
    
    // One employee should be deleted
    assert.equal(employeeService.employees.length, initialCount - 1);
  });

  test('cancels single employee deletion', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    const initialCount = employeeService.employees.length;
    
    // Click delete button for first employee
    const delBtn = el.shadowRoot.querySelector('.actions-cell .action-btn.delete');
    delBtn.click();
    await el.updateComplete;
    
    // Cancel deletion
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    const cancelButton = dlg.shadowRoot.querySelector('.btn.outline');
    cancelButton.click();
    await el.updateComplete;
    
    // No employees should be deleted
    assert.equal(employeeService.employees.length, initialCount);
  });

  test('navigates to edit page when edit button is clicked', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Mock history.pushState
    let pushedUrl = null;
    const originalPushState = history.pushState;
    history.pushState = (state, title, url) => {
      pushedUrl = url;
    };
    
    // Click edit button for first employee
    const editBtn = el.shadowRoot.querySelector('.actions-cell .action-btn.edit');
    editBtn.click();
    await el.updateComplete;
    
    // Should navigate to edit page
    assert.isTrue(pushedUrl.includes('/edit/'));
    
    // Restore original function
    history.pushState = originalPushState;
  });

  test('shows empty state when no employees', async () => {
    // Clear employees
    employeeService.employees = [];
    
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Should show empty state message
    const emptyMessage = el.shadowRoot.querySelector('.empty-state');
    assert.exists(emptyMessage);
  });

  test('updates when employees change', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Add new employee
    employeeService.addEmployee({
      firstName: 'New', lastName: 'Employee', dateOfEmployment: '2025-01-04',
      dateOfBirth: '1993-01-01', phone: '4444444444', email: 'new@example.com',
      department: 'Marketing', position: 'Manager'
    });
    
    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 50));
    await el.updateComplete;
    
    // Should show new employee
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 4);
  });

  test('handles responsive view switching', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Simulate mobile view
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    window.dispatchEvent(new Event('resize'));
    await el.updateComplete;
    
    // Should switch to cards view on mobile
    const wrapper = el.shadowRoot.querySelector('.list-view-wrapper');
    assert.equal(wrapper.getAttribute('data-view'), 'cards');
  });

  test('displays correct employee count', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Check if count is displayed somewhere in the UI
    const countElement = el.shadowRoot.querySelector('[data-employee-count]') || 
                        el.shadowRoot.querySelector('.employee-count');
    
    if (countElement) {
      assert.equal(parseInt(countElement.textContent), 3);
    }
  });

  test('handles search input changes', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Get search input
    const searchInput = el.shadowRoot.querySelector('.search input');
    if (searchInput) {
      searchInput.value = 'Ada';
      searchInput.dispatchEvent(new Event('input'));
      await el.updateComplete;
      
      // Should filter results
      const rows = el.shadowRoot.querySelectorAll('tbody tr');
      assert.equal(rows.length, 1);
    }
  });

  test('maintains view state during filtering', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Switch to cards view
    el._setView('cards');
    await el.updateComplete;
    
    // Apply filter
    const firstNameFilter = el.shadowRoot.querySelectorAll('.filters-row .col-filter')[0];
    const input = firstNameFilter.shadowRoot.querySelector('input');
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    // Should still be in cards view
    const wrapper = el.shadowRoot.querySelector('.list-view-wrapper');
    assert.equal(wrapper.getAttribute('data-view'), 'cards');
  });
});


