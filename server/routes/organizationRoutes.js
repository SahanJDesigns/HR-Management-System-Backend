const express = require('express');
const organizationController = require('../controllers/organizationController');
const organizationRouter = express.Router();

// Route to get organization details
organizationRouter.get('/', organizationController.getOrganizationDetails);

// Route to update organization details
organizationRouter.put('/update', organizationController.updateOrganizationDetails);

module.exports = organizationRouter;
