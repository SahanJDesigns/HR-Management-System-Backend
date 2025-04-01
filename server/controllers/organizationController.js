const organizationModel = require('../models/organizationModel');

const organizationController = {
  // Controller to get organization details
  getOrganizationDetails: async (req, res) => {
    try {
      const organization = await organizationModel.getOrganizationDetails();
      res.status(200).json(organization);
    } catch (err) {
      console.error('Controller: Error fetching organization details:', err);
      res.status(500).json({ error: 'Error fetching organization details' });
    }
  },

  // Controller to update organization details
  updateOrganizationDetails: async (req, res) => {
    const organization = req.body; // Get data from request body
    try {
      const result = await organizationModel.updateOrganizationDetails(organization);
      res.status(200).json({ message: 'Organization details updated successfully', result });
    } catch (err) {
      console.error('Controller: Error updating organization details:', err);
      res.status(500).json({ error: 'Error updating organization details' });
    }
  }
};

module.exports = organizationController;
