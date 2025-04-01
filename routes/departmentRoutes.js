const express = require('express');
const departmentRouter = express.Router();
const departmentController = require('../controllers/departmentController');

departmentRouter.get('/', departmentController.getDepartments); // Read all departments
departmentRouter.get('/:id', departmentController.getDepartment); // Read a single department
departmentRouter.post('/', departmentController.addDepartment); // Create a department
departmentRouter.put('/:id', departmentController.updateDepartment); // Update a department
departmentRouter.delete('/:id', departmentController.deleteDepartment); // Delete a department

module.exports = departmentRouter;
