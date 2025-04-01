const express = require('express');
const branchController = require('../controllers/branchController');
const branchRouter = express.Router();

// Route to get all branches
branchRouter.get('/all', branchController.getAllBranches);

// Route to add a new branch
branchRouter.post('/add', branchController.addBranch);

// Route to delete a branch
branchRouter.delete('/delete/:branch_id', branchController.deleteBranch);

module.exports = branchRouter;
