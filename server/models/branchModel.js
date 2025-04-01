const db = require('../config/dbConfig'); // Import the db connection

const branchModel = {
  // Function to get all branches
  getAllBranches: async () => {
    const query = 'SELECT branch_id, branch_name, address FROM hrms.branch';
    try {
      const [rows] = await db.execute(query); // Execute the SQL query
      return rows;
    } catch (err) {
      console.error('Model: Error fetching branches:', err);
      throw err;
    }
  },

  // Function to add a new branch
  addBranch: async (branch) => {
    const query = `
      INSERT INTO hrms.branch (branch_id, branch_name, address)
      VALUES (?, ?, ?)`;
    
    const params = [
      branch.branch_id,
      branch.branch_name,
      branch.address
    ];

    try {
      const [result] = await db.execute(query, params); // Execute the SQL insert query
      return result;
    } catch (err) {
      console.error('Model: Error adding branch:', err);
      throw err;
    }
  },

  // Function to delete a branch
  deleteBranch: async (branchId) => {
    const query = 'DELETE FROM hrms.branch WHERE branch_id = ?';

    try {
      const [result] = await db.execute(query, [branchId]); // Execute the SQL delete query
      return result;
    } catch (err) {
      console.error('Model: Error deleting branch:', err);
      throw err;
    }
  }
};

module.exports = branchModel;
