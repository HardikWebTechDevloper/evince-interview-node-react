const HttpStatus = require("../../config/http-status");
const { apiResponse } = require("../helpers/api-response.helper");
const employeeController = require("../controllers/employees.controller");
const Joi = require("joi");
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
};

module.exports.createEmployee = async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(2).max(128).required().label("Employee Name"),
            email: Joi.string().email().required().label("Employee Email"),
            employeeId: Joi.string().alphanum().length(10).required().label("Employee Id"),
            mobileNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().label("Employee Mobile No."),
            gender: Joi.string().valid('Male', 'Female', 'Other').required().label("Gender"),
            age: Joi.number().integer().min(18).max(60).required().label("Age"),
            anotherPhoneNumber: Joi.string().pattern(/^[6-9]\d{9}$/).allow("").label('Another Phone Number'),
        });

        // validate request body against schema
        const { error } = schema.validate(req.body, options);

        if (error) {
            let errors = [];
            error.details.forEach((err) => {
                let message = err.message.replace(/["']/g, "");
                errors.push(message);
            });
            return res.json(apiResponse(HttpStatus.PARTIAL_CONTENT, errors.join(', ')));
        } else {
            employeeController.createEmployee(req, res);
        }
    } catch (error) {
        return res.json(apiResponse(HttpStatus.EXPECTATION_FAILED, error.message));
    }
};

module.exports.updateEmployee = async (req, res) => {
    try {
        const schema = Joi.object({
            id: Joi.number().integer().required().label('Id'),
            name: Joi.string().min(2).max(128).required().label("Employee Name"),
            email: Joi.string().email().required().label("Employee Email"),
            employeeId: Joi.string().alphanum().length(10).required().label("Employee Id"),
            mobileNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().label("Employee Mobile No."),
            gender: Joi.string().valid('Male', 'Female', 'Other').required().label("Gender"),
            age: Joi.number().integer().min(18).max(60).required().label("Age"),
            anotherPhoneNumber: Joi.string().pattern(/^[6-9]\d{9}$/).allow("").label('Another Phone Number'),
        });

        // validate request body against schema
        const { error } = schema.validate(req.body, options);

        if (error) {
            let errors = [];
            error.details.forEach((err) => {
                let message = err.message.replace(/["']/g, "");
                errors.push(message);
            });
            return res.json(apiResponse(HttpStatus.PARTIAL_CONTENT, errors.join(', ')));
        } else {
            employeeController.updateEmployee(req, res);
        }
    } catch (error) {
        return res.json(apiResponse(HttpStatus.EXPECTATION_FAILED, error.message, {}, false));
    }
};

module.exports.getAllEmployees = function (req, res, next) {
    try {
        var body = req.body;
        const schema = Joi.object({
            pageNo: Joi.number().required().label("Page No"),
            pageSize: Joi.number().required().label("page Size"),
            searchValue: Joi.string().allow("").label('Serach Value'),
            sortColumn: Joi.string().allow("").label('Sort Column'),
            sortType: Joi.string().allow("").valid('ASC', 'DESC').label('Sort Type'),
        });
        // validate request body against schema
        const { error } = schema.validate(body, options);
        if (error) {
            let errors = [];
            error.details.forEach((err) => {
                let message = err.message.replace(/["']/g, "");
                errors.push(message);
            });
            return res.json(apiResponse(HttpStatus.PARTIAL_CONTENT, errors.join(', ')));
        } else {
            employeeController.getAllEmployees(req, res);
        }
    } catch (Exception) {
        return res.json(apiResponse(HttpStatus.EXPECTATION_FAILED, error.message, {}, false));
    }
}