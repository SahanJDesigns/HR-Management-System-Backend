const  User = require('../models/userModel');
const secretKey = '1234';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.login(username, password);
        if (!user){
            res.status(500).json({ message: 'Invalid Username or Password', error }); 
        }
        res.cookie('user', user, {httpOnly: true, secure: true, sameSite: 'none'});
        res.send('Log in successful');
    } catch (error) {
     
        res.status(500).json({ message: 'Error in login', error });
    }
};

const getUserDetails = async(req, res) => {
    const token = req.cookies['user'];
    const userDetails = await User.getUserDetails(token);
    res.status(200).json({...userDetails});
}

const getUserProfile = async(req, res) => {
    const token = req.cookies['user'];
    const verified = jwt.verify(token, secretKey);
    const employee_id = verified.employee_id;
    const userProfile = await User.getUserProfile(employee_id);
    res.status(200).json({userProfile});
}

module.exports = { 
    login,
    getUserDetails,
    getUserProfile
 };