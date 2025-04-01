const express = require('express');
const {grantPrivileges} = require('../middleware/authentification');
const {
  getJobTitles,
  getPayGrades,
  getSupervisors,
  getDepartments,
  getBranches,
} = require('../controllers/enumController');

const enumRouter = express.Router();

enumRouter.get('/job-titles',grantPrivileges('Employee'), getJobTitles);
enumRouter.get('/pay-grades',grantPrivileges('Employee'), getPayGrades);
enumRouter.get('/supervisors',grantPrivileges('Employee'), getSupervisors);
enumRouter.get('/departments',grantPrivileges('Employee'), getDepartments);
enumRouter.get('/branches',grantPrivileges('Employee'), getBranches);

module.exports = {enumRouter};
