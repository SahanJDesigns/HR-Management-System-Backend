const pool = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { env } = require('process');

const Role = {
    Admin: "Admin",
    HRManager: 'HR Manager',
    Employee: 'Employee',
    Supervisor: 'Supervisor'
};

const User = {
    create(user_id, username, role, employee_id, token) {
        return {
            user_id: user_id,
            username: username,
            role: role,
            employee_id: employee_id,
            token: token
        };
    },

    async login(username, password) {
        try {
            const query = 'SELECT * FROM user WHERE username = ?;';
            const [rows] = await pool.query(query, [username]);
            if (rows.length === 0) {
                throw 'Invalid username or password';
            }

            const userData = rows[0];
            const passwordMatch = await bcrypt.compare(password, userData.password_hash);

            if (!passwordMatch) {
                throw 'Invalid username or password';
            }

            const token = jwt.sign(
                {
                    id: userData.user_id,
                    username: userData.username,
                    role: userData.role,
                    employee_id: userData.employee_id
                },
                process.env.JWT_SECRET,
                { expiresIn: '10h' }
            );
            
            return token;
        } catch (error) { 
            console.error('Error during login:', error);
            return undefined;
        }
    },

    async getUserDetails(token) {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return {username: verified.username, role: verified.role, employee_id: verified.employee_id};
    },

    async getUserProfile(user_id) {
        try{
            const query = 'SELECT profile_pic FROM employee WHERE employee_id = ?;';
            const [rows] = await pool.query(query, [user_id]);
            return 'http://localhost:5000' + rows[0].profile_pic ;
        }catch(error){
            console.error('Error during get user profile:', error);
            return undefined;
        }
    }
};

module.exports = User;
