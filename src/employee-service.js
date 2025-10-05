/**
  Singleton Employee Data Service.
  Manages employee data persistence (localStorage) and state reactivity (EventTarget).
  This service acts as the single source o truth for all employee records, 
  notifying consumers of changes.
 */
class EmployeeService extends EventTarget {
    static instance = null;
    static STORAGE_KEY = 'ing_employees_data';
    
    // Instance property to hold the data in memory
    employees = []; 

    constructor() {
        super();
        this.employees = this._loadData();
    }

    /**
     * Retrieves the singleton instance of the service.
     * @returns {EmployeeService} The single instance of the service.
     */
    static getInstance() {
        if (!EmployeeService.instance) {
            EmployeeService.instance = new EmployeeService();
        }
        return EmployeeService.instance;
    }

    /**
     * Attempts to load employee data from localStorage.
     * Includes defensive error handling for localStorage access failures.
     * @returns {Array<Object>} The array of employee objects or an empty array.
     */
    _loadData() {
        try {
            const data = localStorage.getItem(EmployeeService.STORAGE_KEY);
            // If data exists, parse it, otherwise return an empty array for a clean start.
            return data ? JSON.parse(data) : [];
        } catch (error) {
            // Failure scenario: Log the error and return a safe default.
            console.error('Error loading data from localStorage. Starting with empty data.', error);
            return [];
        }
    }

    /**
     * Attempts to save the current employees state to localStorage.
     * Dispatches an event to notify listeners (Rule 3.1: State reactivity).
     */
    _saveData() {
        try {
            localStorage.setItem(EmployeeService.STORAGE_KEY, JSON.stringify(this.employees));
            
            // Dispatch an event to notify all listening components.
            this.dispatchEvent(new CustomEvent('employees-changed', { detail: { employees: this.employees } }));
        } catch (error) {
             // Failure scenario: Storage full or access denied. Data remains in memory.
             console.error('Error saving data to localStorage. State is not persisted.', error);
        }
    }

    /**
     * Adds a new employee record with a unique ID and saves the state.
     * @param {Object} employeeData - The new employee data from the form.
     */
    addEmployee(employeeData) {
        // Generate a simple unique ID for persistence.
        const newEmployee = { ...employeeData, id: Date.now().toString(36) + Math.random().toString(36).substring(2) };
        this.employees.push(newEmployee);
        this._saveData();
    }

    /**
     * Updates an existing employee record based on its ID and saves the state.
     * @param {Object} updatedEmployee - The employee object with updated data.
     */
    updateEmployee(updatedEmployee) {
        // Defensive check using optional chaining for ID access
        const idToUpdate = updatedEmployee?.id;
        if (!idToUpdate) return; 
        
        const index = this.employees.findIndex(emp => emp.id === idToUpdate);
        if (index !== -1) {
            this.employees[index] = updatedEmployee;
            this._saveData();
        }
    }

    /**
     * Retrieves an employee by their unique ID.
     * @param {string} id - The ID of the employee.
     * @returns {Object | undefined} The employee object or undefined if not found.
     */
    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === id);
    }
    
    /**
     * @param {string} email
     * @param {string | null} currentId - The ID of the employee being edited (null for new records).
     * @returns {boolean} True if the email is unique, false otherwise.
     */
    isEmailUnique(email, currentId = null) {
        if (!email) return true;
        
        return !this.employees.some(emp => 
            (emp?.email?.toLowerCase() === email.toLowerCase()) && emp.id !== currentId
        );
    }

    /**
     * Deletes an employee record by ID and saves the state.
     * @param {string} id - The ID of the employee to delete.
     */
    deleteEmployee(id) {
        if (!id) return;

        this.employees = this.employees.filter(emp => emp.id !== id);
        this._saveData();
    }
}

export const employeeService = EmployeeService.getInstance();