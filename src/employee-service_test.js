import {employeeService} from './employee-service.js';
import {assert} from '@open-wc/testing';

suite('employee-service', () => {
  setup(() => {
    // Reset storage for isolation
    localStorage.removeItem('ing_employees_data');
    employeeService.employees = [];
  });

  teardown(() => {
    // Clean up after each test
    localStorage.removeItem('ing_employees_data');
    employeeService.employees = [];
  });

  test('initializes with empty employees array', () => {
    assert.isArray(employeeService.employees);
    assert.equal(employeeService.employees.length, 0);
  });

  test('adds employee with valid data', () => {
    const employeeData = {
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    };

    employeeService.addEmployee(employeeData);
    
    assert.equal(employeeService.employees.length, 1);
    const addedEmployee = employeeService.employees[0];
    assert.equal(addedEmployee.firstName, 'Ada');
    assert.equal(addedEmployee.lastName, 'Lovelace');
    assert.equal(addedEmployee.email, 'ada@example.com');
    assert.exists(addedEmployee.id);
  });

  test('generates unique IDs for employees', () => {
    const employee1 = {
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    };

    const employee2 = {
      firstName: 'Grace', lastName: 'Hopper',
      dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01',
      phone: '5551112234', email: 'grace@example.com',
      department: 'Tech', position: 'Lead'
    };

    employeeService.addEmployee(employee1);
    employeeService.addEmployee(employee2);

    const ids = employeeService.employees.map(emp => emp.id);
    assert.notEqual(ids[0], ids[1]);
    assert.isTrue(ids.every(id => typeof id === 'string' && id.length > 0));
  });

  test('emits employees-changed event when adding employee', () => {
    let eventEmitted = false;
    const handler = () => eventEmitted = true;
    employeeService.addEventListener('employees-changed', handler);

    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    assert.isTrue(eventEmitted);
    employeeService.removeEventListener('employees-changed', handler);
  });

  test('updates existing employee', () => {
    // Add employee first
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    const employee = employeeService.employees[0];
    employee.lastName = 'King';
    employee.position = 'Lead';

    employeeService.updateEmployee(employee);

    const updatedEmployee = employeeService.getEmployeeById(employee.id);
    assert.equal(updatedEmployee.lastName, 'King');
    assert.equal(updatedEmployee.position, 'Lead');
  });

  test('emits employees-changed event when updating employee', () => {
    let eventEmitted = false;
    const handler = () => eventEmitted = true;
    employeeService.addEventListener('employees-changed', handler);

    // Add employee first
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    eventEmitted = false; // Reset after add

    const employee = employeeService.employees[0];
    employee.lastName = 'King';
    employeeService.updateEmployee(employee);

    assert.isTrue(eventEmitted);
    employeeService.removeEventListener('employees-changed', handler);
  });

  test('deletes employee by ID', () => {
    // Add employees
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    employeeService.addEmployee({
      firstName: 'Grace', lastName: 'Hopper',
      dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01',
      phone: '5551112234', email: 'grace@example.com',
      department: 'Tech', position: 'Lead'
    });

    const employeeToDelete = employeeService.employees[0];
    employeeService.deleteEmployee(employeeToDelete.id);

    assert.equal(employeeService.employees.length, 1);
    assert.isNull(employeeService.getEmployeeById(employeeToDelete.id));
  });

  test('emits employees-changed event when deleting employee', () => {
    let eventEmitted = false;
    const handler = () => eventEmitted = true;
    employeeService.addEventListener('employees-changed', handler);

    // Add employee first
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    eventEmitted = false; // Reset after add

    const employee = employeeService.employees[0];
    employeeService.deleteEmployee(employee.id);

    assert.isTrue(eventEmitted);
    employeeService.removeEventListener('employees-changed', handler);
  });

  test('returns null when getting non-existent employee', () => {
    const result = employeeService.getEmployeeById('non-existent-id');
    assert.isNull(result);
  });

  test('validates email uniqueness', () => {
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    assert.isFalse(employeeService.isEmailUnique('ada@example.com'));
    assert.isTrue(employeeService.isEmailUnique('unique@example.com'));
  });

  test('prevents adding employee with duplicate email', () => {
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    const initialCount = employeeService.employees.length;

    // Try to add employee with same email
    employeeService.addEmployee({
      firstName: 'Grace', lastName: 'Hopper',
      dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01',
      phone: '5551112234', email: 'ada@example.com', // Same email
      department: 'Tech', position: 'Lead'
    });

    assert.equal(employeeService.employees.length, initialCount);
  });

  test('allows updating employee with same email (self)', () => {
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    const employee = employeeService.employees[0];
    employee.firstName = 'Ada Updated';
    employeeService.updateEmployee(employee);

    const updatedEmployee = employeeService.getEmployeeById(employee.id);
    assert.equal(updatedEmployee.firstName, 'Ada Updated');
    assert.equal(updatedEmployee.email, 'ada@example.com');
  });

  test('validates required fields when adding employee', () => {
    const invalidEmployee = {
      firstName: '', // Empty first name
      lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01',
      phone: '5551112233',
      email: 'ada@example.com',
      department: 'Tech',
      position: 'Senior'
    };

    const initialCount = employeeService.employees.length;
    employeeService.addEmployee(invalidEmployee);
    
    // Should not add invalid employee
    assert.equal(employeeService.employees.length, initialCount);
  });

  test('validates email format', () => {
    const invalidEmployee = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01',
      phone: '5551112233',
      email: 'invalid-email', // Invalid email format
      department: 'Tech',
      position: 'Senior'
    };

    const initialCount = employeeService.employees.length;
    employeeService.addEmployee(invalidEmployee);
    
    // Should not add employee with invalid email
    assert.equal(employeeService.employees.length, initialCount);
  });

  test('validates phone number format', () => {
    const invalidEmployee = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01',
      phone: '123', // Invalid phone format
      email: 'ada@example.com',
      department: 'Tech',
      position: 'Senior'
    };

    const initialCount = employeeService.employees.length;
    employeeService.addEmployee(invalidEmployee);
    
    // Should not add employee with invalid phone
    assert.equal(employeeService.employees.length, initialCount);
  });

  test('validates date of birth is before date of employment', () => {
    const invalidEmployee = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfEmployment: '1990-01-01', // Before birth date
      dateOfBirth: '2025-01-01',
      phone: '5551112233',
      email: 'ada@example.com',
      department: 'Tech',
      position: 'Senior'
    };

    const initialCount = employeeService.employees.length;
    employeeService.addEmployee(invalidEmployee);
    
    // Should not add employee with invalid date relationship
    assert.equal(employeeService.employees.length, initialCount);
  });

  test('persists data to localStorage', () => {
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    const storedData = localStorage.getItem('ing_employees_data');
    assert.exists(storedData);
    
    const parsedData = JSON.parse(storedData);
    assert.equal(parsedData.length, 1);
    assert.equal(parsedData[0].firstName, 'Ada');
  });

  test('loads data from localStorage on initialization', () => {
    // Manually set localStorage data
    const testData = [{
      id: 'test-id',
      firstName: 'Test',
      lastName: 'User',
      dateOfEmployment: '2025-01-01',
      dateOfBirth: '1990-01-01',
      phone: '5551112233',
      email: 'test@example.com',
      department: 'Tech',
      position: 'Senior'
    }];
    
    localStorage.setItem('ing_employees_data', JSON.stringify(testData));
    
    // Create new service instance (simulating page reload)
    const newService = new (employeeService.constructor)();
    
    assert.equal(newService.employees.length, 1);
    assert.equal(newService.employees[0].firstName, 'Test');
  });

  test('handles corrupted localStorage data gracefully', () => {
    localStorage.setItem('ing_employees_data', 'invalid-json');
    
    // Should not throw error and should initialize with empty array
    const newService = new (employeeService.constructor)();
    assert.isArray(newService.employees);
    assert.equal(newService.employees.length, 0);
  });

  test('filters employees by search term', () => {
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    employeeService.addEmployee({
      firstName: 'Grace', lastName: 'Hopper',
      dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01',
      phone: '5551112234', email: 'grace@example.com',
      department: 'Analytics', position: 'Lead'
    });

    const results = employeeService.filterEmployees('Ada');
    assert.equal(results.length, 1);
    assert.equal(results[0].firstName, 'Ada');

    const results2 = employeeService.filterEmployees('Tech');
    assert.equal(results2.length, 1);
    assert.equal(results2[0].department, 'Tech');
  });

  test('sorts employees by field', () => {
    employeeService.addEmployee({
      firstName: 'Charlie', lastName: 'Brown',
      dateOfEmployment: '2025-01-03', dateOfBirth: '1992-01-01',
      phone: '5551112235', email: 'charlie@example.com',
      department: 'Tech', position: 'Junior'
    });

    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    const sorted = employeeService.sortEmployees('firstName');
    assert.equal(sorted[0].firstName, 'Ada');
    assert.equal(sorted[1].firstName, 'Charlie');
  });

  test('handles multiple event listeners', () => {
    let count1 = 0;
    let count2 = 0;
    
    const handler1 = () => count1++;
    const handler2 = () => count2++;

    employeeService.addEventListener('employees-changed', handler1);
    employeeService.addEventListener('employees-changed', handler2);

    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    assert.equal(count1, 1);
    assert.equal(count2, 1);

    employeeService.removeEventListener('employees-changed', handler1);
    employeeService.removeEventListener('employees-changed', handler2);
  });

  test('handles bulk operations', () => {
    // Add multiple employees
    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '5551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });

    employeeService.addEmployee({
      firstName: 'Grace', lastName: 'Hopper',
      dateOfEmployment: '2025-01-02', dateOfBirth: '1991-01-01',
      phone: '5551112234', email: 'grace@example.com',
      department: 'Tech', position: 'Lead'
    });

    const ids = employeeService.employees.map(emp => emp.id);
    employeeService.deleteEmployees(ids);

    assert.equal(employeeService.employees.length, 0);
  });
});


