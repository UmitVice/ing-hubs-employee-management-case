import {employeeService} from './employee-service.js';
import {assert} from '@open-wc/testing';

suite('employee-service', () => {
  setup(() => {
    // reset storage for isolation
    localStorage.removeItem('ing_employees_data');
    employeeService.employees = [];
  });

  test('adds, updates, and deletes employee; emits event', async () => {
    let changed = 0;
    const handler = () => changed++;
    employeeService.addEventListener('employees-changed', handler);

    employeeService.addEmployee({
      firstName: 'Ada', lastName: 'Lovelace',
      dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '905551112233', email: 'ada@example.com',
      department: 'Tech', position: 'Senior'
    });
    assert.equal(employeeService.employees.length, 1);
    assert.isAtLeast(changed, 1);

    const emp = employeeService.employees[0];
    emp.lastName = 'King';
    employeeService.updateEmployee(emp);
    assert.equal(employeeService.getEmployeeById(emp.id).lastName, 'King');

    employeeService.deleteEmployee(emp.id);
    assert.equal(employeeService.employees.length, 0);

    employeeService.removeEventListener('employees-changed', handler);
  });

  test('email uniqueness check', () => {
    employeeService.addEmployee({
      firstName: 'A', lastName: 'B', dateOfEmployment: '2025-01-01', dateOfBirth: '1990-01-01',
      phone: '1234567890', email: 'dup@example.com', department: 'Analytics', position: 'Junior'
    });
    assert.isFalse(employeeService.isEmailUnique('dup@example.com'));
    assert.isTrue(employeeService.isEmailUnique('unique@example.com'));
  });
});


