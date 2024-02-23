const employeeValidations = require("../validations/employees.validation");

module.exports = (app) => {
    app.route('/createEmployee').post(employeeValidations.createEmployee);
    app.route('/updateEmployee').put(employeeValidations.updateEmployee);
    app.route('/getAllEmployees').post(employeeValidations.getAllEmployees);
};