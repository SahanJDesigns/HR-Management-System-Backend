const express = require('express');
const employeeController = require('../controllers/employeeController')
const employeeRouter = express.Router();
const {grantPrivileges} = require('../middleware/authentification');

employeeRouter.get('/',grantPrivileges('Supervisor'), employeeController.getAllEmployees);
employeeRouter.post('/addDependent',grantPrivileges('HR Manager'), employeeController.addDependent);
employeeRouter.post('/addEmergencyPerson',grantPrivileges('HR Manager'), employeeController.addEmergencyPerson);
employeeRouter.post('/createUser',grantPrivileges('HR Manager'), employeeController.createUser);
employeeRouter.get('/:employeeId',grantPrivileges('Employee'),employeeController.getEmployee);
employeeRouter.get('/:employeeId/personal',grantPrivileges('Employee'),employeeController.getEmployeePersonal);
employeeRouter.get('/:employeeId/official',grantPrivileges('Employee'), employeeController.getEmployeeOfficialInfo);
employeeRouter.get('/:employeeId/dependents',grantPrivileges('Employee'), employeeController.getEmployeeDependents);
employeeRouter.get('/:employeeId/emergency',grantPrivileges('Employee'),employeeController.getEmployeeEmergencyContacts);

employeeRouter.get('/', employeeController.getAllEmployees);

// employeeRouter.get('/:id', employeeController.getEmployeeById);

/*employeeRouter.post('/create', employeeController.createEmployee);
employeeRouter.put('/update', employeeController.updateEmployee);
employeeRouter.delete('/delete', employeeController.deleteEmployee);*/

module.exports = {employeeRouter};
