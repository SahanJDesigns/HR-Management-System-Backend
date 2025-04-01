const express = require('express');
const userController = require('../controllers/userController');
const {grantPrivileges} = require('../middleware/authentification');

const userRouter = express.Router();

userRouter.post('/login',userController.login);
userRouter.get('/getdetails',grantPrivileges('Employee'),userController.getUserDetails)
userRouter.get('/getprofile',grantPrivileges('Employee'),userController.getUserProfile)

module.exports = { userRouter };

