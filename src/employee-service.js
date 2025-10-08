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

    /** Adds a new employee with a generated ID. */
    /** @param {Omit<Employee,'id'>} employeeData */
    addEmployee(employeeData) {
        const newEmployee = /** @type {Employee} */({ ...employeeData, id: Date.now().toString(36) + Math.random().toString(36).substring(2) });
        this.employees.push(newEmployee);
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
        return this.employees.find(emp => emp.id === id);
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
}

export const employeeService = EmployeeService.getInstance();