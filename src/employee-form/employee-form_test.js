import './employee-form.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {employeeService} from '@/employee-service.js';

suite('employee-form', () => {
  setup(() => {
    employeeService.employees = [];
    // Reset URL to home
    history.pushState(null, '', '/');
  });

  teardown(() => {
    // Clean up URL after each test
    history.pushState(null, '', '/');
  });

  test('renders form with all required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;
    
    // Check all form fields exist
    assert.exists(el.shadowRoot.querySelector('#firstName'));
    assert.exists(el.shadowRoot.querySelector('#lastName'));
    assert.exists(el.shadowRoot.querySelector('#dateOfEmployment'));
    assert.exists(el.shadowRoot.querySelector('#dateOfBirth'));
    assert.exists(el.shadowRoot.querySelector('#phone'));
    assert.exists(el.shadowRoot.querySelector('#email'));
    assert.exists(el.shadowRoot.querySelector('#department'));
    assert.exists(el.shadowRoot.querySelector('#position'));
  });

  test('validates required fields and shows errors', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const form = el.shadowRoot.querySelector('form');
    
    // Submit empty form
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    
    // Should show validation errors
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });

  test('validates email format', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill valid data except email
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#phone').value = '905551112233';
    el.shadowRoot.querySelector('#phone').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#department').value = 'Tech';
    el.shadowRoot.querySelector('#department').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#position').value = 'Senior';
    el.shadowRoot.querySelector('#position').dispatchEvent(new Event('change'));
    
    // Set invalid email
    el.shadowRoot.querySelector('#email').value = 'invalid-email';
    el.shadowRoot.querySelector('#email').dispatchEvent(new Event('input'));
    
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    
    // Should show email validation error
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });

  test('validates phone number format', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill valid data except phone
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#email').value = 'ada@example.com';
    el.shadowRoot.querySelector('#email').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#department').value = 'Tech';
    el.shadowRoot.querySelector('#department').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#position').value = 'Senior';
    el.shadowRoot.querySelector('#position').dispatchEvent(new Event('change'));
    
    // Set invalid phone
    el.shadowRoot.querySelector('#phone').value = '123';
    el.shadowRoot.querySelector('#phone').dispatchEvent(new Event('input'));
    
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    
    // Should show phone validation error
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });

  test('validates date of birth is before date of employment', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill valid data with invalid date relationship
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
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
    
    // Should show date validation error
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });

  test('submits new employee when valid with confirm dialog', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill all inputs with valid data
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
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
    
    // Should show confirm dialog
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    assert.exists(dlg);
    assert.isTrue(dlg.open);
    
    // Confirm the dialog
    const confirmBtn = dlg.shadowRoot.querySelector('.confirm');
    confirmBtn.click();
    await el.updateComplete;
    
    // Should add employee to service
    assert.equal(employeeService.employees.length, 1);
    assert.equal(employeeService.employees[0].firstName, 'Ada');
    assert.equal(employeeService.employees[0].lastName, 'Lovelace');
  });

  test('cancels form submission when confirm dialog is cancelled', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill all inputs with valid data
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
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
    
    // Cancel the dialog
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    const cancelBtn = dlg.shadowRoot.querySelector('.btn.outline');
    cancelBtn.click();
    await el.updateComplete;
    
    // Should not add employee to service
    assert.equal(employeeService.employees.length, 0);
  });

  test('loads existing employee for edit and updates', async () => {
    // Seed one employee
    employeeService.addEmployee({
      firstName: 'Grace', lastName: 'Hopper', dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01', phone: '1111111111', email: 'g@example.com',
      department: 'Analytics', position: 'Junior'
    });
    const id = employeeService.employees[0].id;
    history.pushState(null, '', `/edit/${id}`);
    
    const el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;
    
    // Should load existing data
    assert.equal(el.shadowRoot.querySelector('#firstName').value, 'Grace');
    assert.equal(el.shadowRoot.querySelector('#lastName').value, 'Hopper');
    
    // Change last name
    el.shadowRoot.querySelector('#lastName').value = 'Updated';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    
    const dlg = el.shadowRoot.querySelector('confirm-dialog');
    dlg.shadowRoot.querySelector('.confirm').click();
    await el.updateComplete;
    
    // Should update existing employee
    assert.equal(employeeService.employees[0].lastName, 'Updated');
  });

  test('prevents duplicate email addresses', async () => {
    // Add existing employee
    employeeService.addEmployee({
      firstName: 'Existing', lastName: 'User', dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01', phone: '1111111111', email: 'existing@example.com',
      department: 'Tech', position: 'Senior'
    });
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill form with duplicate email
    el.shadowRoot.querySelector('#firstName').value = 'New';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'User';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#phone').value = '2222222222';
    el.shadowRoot.querySelector('#phone').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#email').value = 'existing@example.com';
    el.shadowRoot.querySelector('#email').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#department').value = 'Tech';
    el.shadowRoot.querySelector('#department').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#position').value = 'Senior';
    el.shadowRoot.querySelector('#position').dispatchEvent(new Event('change'));

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    await el.updateComplete;
    
    // Should show email validation error
    const errors = el.shadowRoot.querySelectorAll('.error-text');
    assert.isAtLeast(errors.length, 1);
  });

  test('clears form after successful submission', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill and submit form
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#dateOfEmployment').value = '2025-01-01';
    el.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('change'));
    el.shadowRoot.querySelector('#dateOfBirth').value = '1990-01-01';
    el.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('change'));
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
    dlg.shadowRoot.querySelector('.confirm').click();
    await el.updateComplete;
    
    // Form should be cleared
    assert.equal(el.shadowRoot.querySelector('#firstName').value, '');
    assert.equal(el.shadowRoot.querySelector('#lastName').value, '');
  });

  test('handles form reset button', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill form
    el.shadowRoot.querySelector('#firstName').value = 'Ada';
    el.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    el.shadowRoot.querySelector('#lastName').value = 'Lovelace';
    el.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    
    // Click reset button
    const resetBtn = el.shadowRoot.querySelector('app-button[type="reset"]');
    resetBtn.click();
    await el.updateComplete;
    
    // Form should be cleared
    assert.equal(el.shadowRoot.querySelector('#firstName').value, '');
    assert.equal(el.shadowRoot.querySelector('#lastName').value, '');
  });

  test('shows loading state during initial load', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Should show loading state initially
    assert.isTrue(el._isLoading);
    
    // Wait for connectedCallback to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    await el.updateComplete;
    
    // Should not be loading anymore
    assert.isFalse(el._isLoading);
  });

  test('shows loading state when employee not found', async () => {
    // Set invalid edit URL
    history.pushState(null, '', '/edit/nonexistent-id');
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Should show loading state initially
    assert.isTrue(el._isLoading);
    
    // Wait for connectedCallback to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    await el.updateComplete;
    
    // Should not be loading anymore (redirected)
    assert.isFalse(el._isLoading);
  });

  test('handles async connectedCallback for edit mode', async () => {
    // Add employee first
    employeeService.addEmployee({
      firstName: 'Test', lastName: 'User', dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01', phone: '1111111111', email: 'test@example.com',
      department: 'Tech', position: 'Senior'
    });
    const id = employeeService.employees[0].id;
    history.pushState(null, '', `/edit/${id}`);
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Should show loading state initially
    assert.isTrue(el._isLoading);
    
    // Wait for async connectedCallback to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    await el.updateComplete;
    
    // Should be in edit mode with loaded data
    assert.equal(el.mode, 'edit');
    assert.equal(el.employee.firstName, 'Test');
    assert.isFalse(el._isLoading);
  });

  test('handles error in connectedCallback', async () => {
    // Mock console.error to avoid test output
    const originalError = console.error;
    console.error = () => {};
    
    // Set invalid URL that might cause error
    history.pushState(null, '', '/edit/');
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Wait for async connectedCallback to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    await el.updateComplete;
    
    // Should handle error gracefully
    assert.isFalse(el._isLoading);
    
    // Restore console.error
    console.error = originalError;
  });

  test('renders loading UI when _isLoading is true', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Manually set loading state
    el._isLoading = true;
    await el.updateComplete;
    
    // Should show loading UI
    const loadingText = el.shadowRoot.querySelector('p');
    assert.exists(loadingText);
    assert.include(loadingText.textContent, 'Loading');
  });

  test('has correct font weight for input fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;
    
    // Check that input fields have regular font weight
    const inputs = el.shadowRoot.querySelectorAll('input, select');
    inputs.forEach(input => {
      const computedStyle = getComputedStyle(input);
      assert.equal(computedStyle.fontWeight, '400'); // regular weight
    });
  });

  test('has correct date picker styling', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;
    
    // Check date inputs have correct styling
    const dateInputs = el.shadowRoot.querySelectorAll('input[type="text"]');
    dateInputs.forEach(input => {
      if (input.placeholder === 'dd/mm/yyyy') {
        const computedStyle = getComputedStyle(input);
        assert.equal(computedStyle.fontWeight, '400'); // regular weight
      }
    });
  });

  test('has correct form layout with max-width and centering', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;
    
    // Wait for CSS to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const form = el.shadowRoot.querySelector('form');
    const computedStyle = getComputedStyle(form);
    
    // Should have max-width and be centered
    assert.equal(computedStyle.maxWidth, '900px');
    assert.equal(computedStyle.marginLeft, 'auto');
    assert.equal(computedStyle.marginRight, 'auto');
  });
});


