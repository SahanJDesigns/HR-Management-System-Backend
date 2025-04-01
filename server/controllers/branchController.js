const branchModel = require('../models/branchModel');

const branchController = {
  // Controller to get all branches
  getAllBranches: async (req, res) => {
    try {
      const branches = await branchModel.getAllBranches();
      res.status(200).json(branches);
    } catch (err) {
      console.error('Controller: Error fetching branches:', err);
      res.status(500).json({ error: 'Error fetching branches' });
    }
  },

  // Controller to add a new branch
  addBranch: async (req, res) => {
    const branch = req.body; // Get data from request body
    try {
      const result = await branchModel.addBranch(branch);
      res.status(200).json({ message: 'Branch added successfully', result });
    } catch (err) {
      console.error('Controller: Error adding branch:', err);
      res.status(500).json({ error: 'Error adding branch' });
    }
  },

  // Controller to delete a branch
  deleteBranch: async (req, res) => {
    const { branch_id } = req.params; // Get branch_id from request parameters
    try {
      const result = await branchModel.deleteBranch(branch_id);
      res.status(200).json({ message: 'Branch deleted successfully', result });
    } catch (err) {
      console.error('Controller: Error deleting branch:', err);
      res.status(500).json({ error: 'Error deleting branch' });
    }
  }
};

module.exports = branchController;
