const express = require('express');
const dependentController = require('../controllers/dependentController');

const dependentRouter = express.Router();


dependentRouter.get('/:employee_id', dependentController.getAllDependents);

dependentRouter.post('/', dependentController.createDependent);

dependentRouter.delete('/:dependent_id', dependentController.deleteDependent);

module.exports = {dependentRouter};