/** Employee data service using localStorage and EventTarget. */
// @ts-check
/** @typedef {import('./types.js').Employee} Employee */
/** @typedef {import('./types.js').EmployeeId} EmployeeId */
/** @typedef {import('./types.js').EmployeesChangedEvent} EmployeesChangedEvent */
class EmployeeService extends EventTarget {
    static instance = null;
    static STORAGE_KEY = 'ing_employees_data';
    
    /** @type {Employee[]} */
    employees = []; 

    constructor() {
        super();
        this.employees = this._loadData();
    }

    /** Returns the singleton instance. */
    static getInstance() {
        if (!EmployeeService.instance) {
            EmployeeService.instance = new EmployeeService();
        }
        return EmployeeService.instance;
    }

    /** Loads employee data from localStorage. */
    /** @returns {Employee[]} */
    _loadData() {
        try {
            const data = localStorage.getItem(EmployeeService.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading data from localStorage. Starting with empty data.', error);
            return [];
        }
    }

    /** Persists state to localStorage and notifies listeners. */
    _saveData() {
        try {
            localStorage.setItem(EmployeeService.STORAGE_KEY, JSON.stringify(this.employees));
            /** @type {EmployeesChangedEvent} */
            const evt = new CustomEvent('employees-changed', { detail: { employees: this.employees } });
            this.dispatchEvent(evt);
        } catch (error) {
             console.error('Error saving data to localStorage. State is not persisted.', error);
        }
    }

    /** Validates employee data. */
    /** @param {Omit<Employee,'id'>} employeeData */
    _validateEmployee(employeeData) {
        // Check required fields
        if (!employeeData?.firstName?.trim() || !employeeData?.lastName?.trim()) {
            return false;
        }

        // Validate email format
        if (employeeData.email && !this._isValidEmail(employeeData.email)) {
            return false;
        }

        // Validate phone format
        if (employeeData.phone && !this._isValidPhone(employeeData.phone)) {
            return false;
        }

        // Validate date relationship
        if (employeeData.dateOfBirth && employeeData.dateOfEmployment) {
            const birthDate = new Date(employeeData.dateOfBirth);
            const employmentDate = new Date(employeeData.dateOfEmployment);
            if (birthDate >= employmentDate) {
                return false;
            }
        }

        return true;
    }

    /** Validates email format. */
    /** @param {string} email */
    _isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /** Validates phone format. */
    /** @param {string} phone */
    _isValidPhone(phone) {
        const digits = String(phone || '').replace(/\D/g, '');
        return /^\d{10}$/.test(digits);
    }

    /** Adds a new employee with a generated ID. */
    /** @param {Omit<Employee,'id'>} employeeData */
    addEmployee(employeeData) {
        // Validate employee data
        if (!this._validateEmployee(employeeData)) {
            return;
        }

        // Prevent accidental duplicates by email
        const email = (employeeData?.email || '').toLowerCase();
        if (email && this.employees.some(e => (e.email || '').toLowerCase() === email)) {
            return; // ignore duplicate add
        }
        const newEmployee = /** @type {Employee} */({ ...employeeData, id: Date.now().toString(36) + Math.random().toString(36).substring(2) });
        // Insert newest at the beginning so it appears first in the list
        this.employees.unshift(newEmployee);
        this._saveData();
    }

    /** Updates an employee by ID. */
    /** @param {Employee} updatedEmployee */
    updateEmployee(updatedEmployee) {
        const idToUpdate = updatedEmployee?.id;
        if (!idToUpdate) return; 
        
        const index = this.employees.findIndex(emp => emp.id === idToUpdate);
        if (index !== -1) {
            this.employees[index] = updatedEmployee;
            this._saveData();
        }
    }

    /** Returns employee by ID. */
    /** @param {EmployeeId} id */
    getEmployeeById(id) {
        const employee = this.employees.find(emp => emp.id === id);
        return employee || null;
    }
    
    /** Checks email uniqueness, excluding currentId if provided. */
    /** @param {string} email @param {EmployeeId|null} [currentId=null] */
    isEmailUnique(email, currentId = null) {
        if (!email) return true;
        
        return !this.employees.some(emp => 
            (emp?.email?.toLowerCase() === email.toLowerCase()) && emp.id !== currentId
        );
    }

    /** Deletes an employee by ID. */
    /** @param {EmployeeId} id */
    deleteEmployee(id) {
        if (!id) return;

        this.employees = this.employees.filter(emp => emp.id !== id);
        this._saveData();
    }

    /** Filters employees by search term. */
    /** @param {string} searchTerm */
    filterEmployees(searchTerm) {
        if (!searchTerm) return this.employees;

        const term = searchTerm.toLowerCase();
        return this.employees.filter(emp => 
            emp.firstName?.toLowerCase().includes(term) ||
            emp.lastName?.toLowerCase().includes(term) ||
            emp.email?.toLowerCase().includes(term) ||
            emp.department?.toLowerCase().includes(term) ||
            emp.position?.toLowerCase().includes(term)
        );
    }

    /** Sorts employees by field. */
    /** @param {string} field */
    sortEmployees(field) {
        const sorted = [...this.employees];
        sorted.sort((a, b) => {
            const aVal = a[field] || '';
            const bVal = b[field] || '';
            return aVal.localeCompare(bVal);
        });
        return sorted;
    }

    /** Deletes multiple employees by IDs. */
    /** @param {EmployeeId[]} ids */
    deleteEmployees(ids) {
        if (!Array.isArray(ids)) return;

        this.employees = this.employees.filter(emp => !ids.includes(emp.id));
        this._saveData();
    }
}

export const employeeService = EmployeeService.getInstance();