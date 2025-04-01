const db = require('../config/dbConfig'); // Import the db connection

const organizationModel = {
  // Function to get the current organization details
  getOrganizationDetails: async () => {
    const query = 'SELECT organization_id, organization_name, address, registration_number, latitude, longitude FROM hrms.organization';
    try {
      const [rows] = await db.execute(query); // Execute the SQL query
      return rows[0]; // Return the first row (assuming one organization record)
    } catch (err) {
      console.error('Model: Error fetching organization details:', err);
      throw err;
    }
  },

  // Function to update the organization details
  updateOrganizationDetails: async (organization) => {
    const query = `
      UPDATE hrms.organization 
      SET organization_name = ?, address = ?, registration_number = ?, latitude = ?, longitude = ?
      WHERE organization_id = ?`;
    
    const params = [
      organization.organization_name,
      organization.address,
      organization.registration_number,
      organization.latitude,
      organization.longitude,
      organization.organization_id
    ];

    try {
      const [result] = await db.execute(query, params); // Execute the SQL update query
      return result;
    } catch (err) {
      console.error('Model: Error updating organization details:', err);
      throw err;
    }
  }
};

module.exports = organizationModel;
