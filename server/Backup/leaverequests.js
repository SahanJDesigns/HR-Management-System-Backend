const pool = require('./dbConfig');
const jwt = require('jsonwebtoken');
const secretKey = '1234';

const getEmployeeLeaves = async (req, res) => {
    try {
        // Get the token from the cookies
        const token = req.cookies['user'];
        if (!token) return res.status(401).json({ message: "No token found" });
        
        // Verify the token
        const verified = jwt.verify(token, secretKey);
        if (!verified) return res.status(403).json({ message: "Invalid token" });
        
        // SQL query for retrieving employee leave data
        const query = `
            SELECT leave_id,start_date,end_date,request_status,first_name,last_name,jobtitle.name,type_name FROM leaverequest
            join employee on employee.employee_id = leaverequest.employee_id
            join jobtitle on employee.job_title_id = jobtitle.job_title_id
            join leavetype on leaverequest.leave_type_id = leavetype.leave_type_id;
        `;
        
        // Execute the query
        const [employeeLeaves] = await pool.query(query);

        // Check if there are any leaves
        if (!employeeLeaves || employeeLeaves.length === 0) {
            return res.status(404).json({ message: 'No leave records found' });
        }

        // Process each leave record to calculate the duration and format the response
        const processedLeaves = employeeLeaves.map(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            return {
                leave_id: leave.leave_id,
                start_date: leave.start_date,
                end_date: leave.end_date,
                type_name: leave.type_name,
                request_status: leave.request_status,
                name: `${leave.first_name} ${leave.last_name}`,
                job_title: leave.name,
                duration: `${duration} days`
            };
        });

        // Send the processed leaves
        res.status(200).json(processedLeaves);

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid token or error fetching data' });
    }
};

const updateLeaveStatus = async (req, res) => {
    try {
        // Get the token from the cookies
        const token = req.cookies['user'];
        if (!token) return res.status(401).json({ message: "No token found" });
        
        // Verify the token
        const verified = jwt.verify(token, secretKey);
        if (!verified) return res.status(403).json({ message: "Invalid token" });

        // Get the leave ID and status from the request body
        const { leave_id, status } = req.body;

        // SQL query for updating the leave status
        const query = 'UPDATE leaverequest SET request_status = ? WHERE leave_id = ?';
        
        // Execute the query
        await pool.query(query, [status, leave_id]);

        // Send the response
        res.status(200).json({ message: 'Leave status updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid token or error updating leave status' });
    }
};

const addLeaveRequest = async (req,res) => {
    try{
        const token = req.cookies['user'];
        if (!token) return res.status(401).json({ message: 'No token found' });
        const verified = jwt.verify(token,secretKey);
        const {start_date,end_date,leave_type,description} = req.body;
        const employee_id = verified.employee_id;
        const query = "insert into leaverequest (leave_id,employee_id,start_date,end_date,leave_type_id,description) values (UUID(),?,?,?,?,?);";
        pool.query(query,[employee_id,start_date,end_date,leave_type,description]);
    }catch(err){
        console.error(err);
        res.status(400).json({error: 'Invalid token or error updating leave status'});
    }
}

const getLeaveTypes = async (req,res) => {
    try{
        const query = "select * from leavetype";
        const [leaveTypes] = await pool.query(query);
        res.status(200).json(leaveTypes);
    }
    catch(err){
        console.error(err);
        res.status(400).json({error: 'error fetching leave types'});
    }
}


const getLeaveRequestofUser = async (req,res) => {
    try{
        const token = req.cookies['user'];
        if (!token) return res.status(401).json({ message: 'No token found' });
        const verified = jwt.verify(token,secretKey);
        const employee_id = verified.employee_id;

        const query = `select * from leaverequest
            join leavetype on leavetype.leave_type_id = leaverequest.leave_type_id 
            where employee_id = ?`;
        const [leaverequests] = await pool.query(query,[employee_id]);
        const processedLeaves = leaverequests.map(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            return {
                leave_id: leave.leave_id,
                start_date: leave.start_date,
                end_date: leave.end_date,
                type_name: leave.type_name,
                request_status: leave.request_status,
                duration: `${duration} days`
            };
        });
        res.status(200).json(processedLeaves);
    }catch(err){
        console.error(err);
        res.status(400).json({error: 'error fetching leave requests'});
    }
}

module.exports = {
    getEmployeeLeaves,
    updateLeaveStatus,
    addLeaveRequest,
    getLeaveRequestofUser,
    getLeaveTypes
};
