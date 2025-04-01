const express = require('express');
const leaveController = require('../controllers/leaveController');
const leaveRouter = express.Router();
const {grantPrivileges} = require('../middleware/authentification');

leaveRouter.get('/', leaveController.getEmployeeLeaves);
leaveRouter.put('/update',grantPrivileges('Supervisor'),leaveController.updateLeaveStatus);
leaveRouter.post('/add',grantPrivileges('Employee'),leaveController.addLeaveRequest);
leaveRouter.get('/types',grantPrivileges('Employee'),leaveController.getLeaveTypes);
leaveRouter.get('/user',leaveController.getLeaveRequestOfUser);

leaveRouter.get('/leave-count',grantPrivileges('Employee'), leaveController.getLeaveCountDetails);               
leaveRouter.get('/alltypes',leaveController.getAllLeaveTypes)
leaveRouter.post('/add-type',leaveController.addLeaveType)
leaveRouter.delete('/:leaveId', leaveController.deleteLeaveRequest);
  
leaveRouter.delete('/delete/:leave_type_id', leaveController.deleteLeaveType);
leaveRouter.put('/increment/:leave_type_id', leaveController.incrementLeaveTypeLeaveCount);
leaveRouter.put('/decrement/:leave_type_id', leaveController.decrementLeaveTypeLeaveCount);

module.exports = {leaveRouter};
