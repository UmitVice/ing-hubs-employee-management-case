// Central JSDoc type declarations for the app. Enables editor IntelliSense and JS type checking.

/**
 * Department values allowed in the application.
 * @readonly
 * @type {readonly ['Analytics','Tech']}
 */
export const Departments = ['Analytics', 'Tech'];

/**
 * Position values allowed in the application.
 * @readonly
 * @type {readonly ['Junior','Medior','Senior']}
 */
export const Positions = ['Junior', 'Medior', 'Senior'];

/** @typedef {'Analytics'|'Tech'} Department */
/** @typedef {'Junior'|'Medior'|'Senior'} Position */

/**
 * ISO date string in the form YYYY-MM-DD.
 * @typedef {string} IsoDate
 */

/**
 * Unique employee identifier (random base36 string).
 * @typedef {string} EmployeeId
 */

/**
 * Employee record.
 * @typedef {Object} Employee
 * @property {EmployeeId} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {IsoDate} dateOfEmployment
 * @property {IsoDate} dateOfBirth
 * @property {string} phone        - Digits only, 10-15 length
 * @property {string} email
 * @property {Department} department
 * @property {Position} position
 */

/**
 * CustomEvent payload for the 'employees-changed' event.
 * @typedef {CustomEvent<{ employees: Employee[] }>} EmployeesChangedEvent
 */


