const { Employees } = require("../../models/index");
const HttpStatus = require("../../config/http-status");
const { apiResponse } = require("../helpers/api-response.helper");
const { Op } = require("sequelize");
const constants = require("../../config/constants");

module.exports.createEmployee = async (req, res) => {
    try {
        const body = req.body;

        let [user, created] = await Employees.findOrCreate({
            where: { email: body.email },
            defaults: body
        });

        if (user) {
            if (created) {
                return res.json(apiResponse(HttpStatus.OK, "Employee details has been saved successfully", {}, true));
            } else {
                return res.json(apiResponse(HttpStatus.OK, "Employee email is already exists in our records", {}, false));
            }
        } else {
            return res.json(apiResponse(HttpStatus.OK, "Something went wrong while create a employee", {}, false));
        }
    } catch (error) {
        return res.json(apiResponse(HttpStatus.EXPECTATION_FAILED, error?.message, {}, false));
    }
}

module.exports.updateEmployee = async (req, res) => {
    try {
        const body = req.body;

        let checkUniqueEmail = await Employees.count({
            where: {
                id: { [Op.ne]: body.id },
                email: body.email
            }
        });

        if (checkUniqueEmail && checkUniqueEmail > 0) {
            return res.json(apiResponse(HttpStatus.OK, "Employee email is already exists in our records", {}, false));
        }

        let isUpdated = await Employees.update({
            name: body.name,
            email: body.email,
            employeeId: body.employeeId,
            mobileNumber: body.mobileNumber,
            gender: body.gender,
            age: body.age,
            phoneNumber: body.phoneNumber,
        }, {
            where: { id: body.id }
        });

        if (isUpdated) {
            return res.json(apiResponse(HttpStatus.OK, "Employee details has been updated successfully", {}, true));
        } else {
            return res.json(apiResponse(HttpStatus.OK, "Something went wrong while update a employee", {}, false));
        }
    } catch (error) {
        return res.json(apiResponse(HttpStatus.EXPECTATION_FAILED, error?.message, {}, false));
    }
}

module.exports.getAllEmployees = async (req, res) => {
    try {
        let { pageSize, pageNo, searchValue, sortColumn, sortType } = req.body;

        // Pagination
        let offset = 0;
        if (pageNo) {
            offset = (pageSize * pageNo) - pageSize;
        }

        // Sorting
        let orderBy = ['id', 'DESC'];
        if (sortColumn && sortType) {
            orderBy = [sortColumn, sortType];
        }

        // Where Clause
        let whereClauses = {};
        if (searchValue) {
            whereClauses = {
                [Op.or]: [
                    { 'name': { [Op.like]: `%${searchValue}%` } },
                    { 'email': { [Op.like]: `%${searchValue}%` } },
                    { 'employeeId': { [Op.like]: `%${searchValue}%` } },
                    { 'mobileNumber': { [Op.like]: `%${searchValue}%` } },
                ]
            };
        }

        let employeesData = await Employees.findAll({
            attributes: ['id', 'name', 'email', 'employeeId', 'mobileNumber', 'age', 'gender', 'phoneNumber', 'createdAt', 'updatedAt'],
            where: whereClauses,
            offset: offset,
            limit: pageSize,
            order: [orderBy]
        });

        if (employeesData && employeesData.length > 0) {
            let totalRows = await Employees.count({ where: whereClauses });
            return res.json(apiResponse(HttpStatus.OK, "Employees found", { totalRows, employeesData }, true));
        } else {
            return res.json(apiResponse(HttpStatus.OK, "No data found", { totalRows: 0, employeesData: [] }, false));
        }
    } catch (error) {
        return res.json(apiResponse(HttpStatus.EXPECTATION_FAILED, error?.message, {}, false));
    }
}