const express = require('express');
const reportRouter = express.Router();
const employeeController = require('../controllers/reportController');

// Route to fetch employees grouped by job title, department, and pay grade
reportRouter.get('/employees-grouped', employeeController.fetchEmployeesGrouped);

// Route to fetch employee count by department
reportRouter.get('/emp-report', employeeController.fetchEmployeeCountByDepartment);

// Route to fetch employee stats
reportRouter.get('/emp-stats', employeeController.fetchEmployeeStats);

// Route to fetch total leaves by department
reportRouter.get('/department-leaves', employeeController.fetchDepartmentLeaves);

//Route to fetch empergency person & dependant details related to an employee
reportRouter.get('/emp-details/:empId', employeeController.fetchEmpEmergencyPersonDetails);

module.exports = reportRouter;
