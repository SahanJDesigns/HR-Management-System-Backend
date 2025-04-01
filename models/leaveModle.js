const pool = require('../config/dbConfig');
const db = require('../config/dbConfig');

const jwt = require('jsonwebtoken');
const secretKey = '1234';

const leaveModel = {
    getAllEmployeeLeaves: async (employee_id) => {
    const query = `
        SELECT leave_id, start_date, end_date, request_status, first_name, last_name, job_title_name, type_name 
        FROM leaverequest
        JOIN employee ON employee.employee_id = leaverequest.employee_id
        JOIN jobtitle ON employee.job_title_id = jobtitle.job_title_id
        JOIN leavetype ON leaverequest.leave_type_id = leavetype.leave_type_id
        WHERE start_date > CURDATE()-7 AND employee.supervisor_id = ?
        ORDER BY start_date DESC;
    `;

        const [employeeLeaves] = await pool.query(query, [employee_id]);
        return employeeLeaves;
    },

    updateLeaveStatus: async (leave_id, status) => {
        const query = 'UPDATE leaverequest SET request_status = ? WHERE leave_id = ?';
        await pool.query(query, [status, leave_id]);
    },

    addLeaveRequest: async (leave_id,employee_id, start_date, end_date, leave_type, description) => {
        const query = "INSERT INTO leaverequest (leave_id, employee_id, start_date, end_date, leave_type_id, description,request_status) VALUES (?, ?, ?, ?, ?, ?, ?);";
        await pool.query(query, [leave_id,employee_id, start_date, end_date, leave_type, description,"Pending"]);
    },
    deleteLeaveRequest: async (leave_id) => {
      const query = 'DELETE FROM leaverequest WHERE leave_id = ?';
      try {
        await pool.query(query, [leave_id]);
      } catch (err) {
        console.error('Error deleting leave request:', err);
        throw err;
      }
    },

    getLeaveTypes: async (token) => {
        const valid = jwt.verify(token, secretKey);
        const employee_id = valid.employee_id;
        const query = `SELECT lt.*
        FROM leavetype lt
        JOIN employee e ON e.employee_id = ?
        WHERE is_allowed_leave_type(e.pay_grade_id, e.gender, lt.leave_type_id) = 1;`;
        const [leaveTypes] = await pool.query(query, [employee_id]);
        return leaveTypes;
    },


    getAllLeaveTypes: async () => {
        // Corrected query to target the correct schema and table
        const query = 'SELECT leave_type_id, type_name, default_days, pay_grade_id FROM hrms.leavetype';
        try {
          const [rows] = await db.execute(query);
          return rows;
        } catch (err) {
          console.error('Model: Database query error:', err);
          throw err;
        }
    },

    editAllLeaveTypes: async (leaveTypes) => {
        try {
          // Use a transaction to ensure atomic updates
          const connection = await db.getConnection();
          await connection.beginTransaction();
    
          for (const leaveType of leaveTypes) {
            const { leave_type_id, type_name, default_days, pay_grade_id } = leaveType;
            const query = `
              UPDATE leave_types 
              SET type_name = ?, default_days = ?, pay_grade_id = ? 
              WHERE leave_type_id = ?
            `;
            await connection.execute(query, [type_name, default_days, pay_grade_id, leave_type_id]);
          }
    
          await connection.commit(); // Commit the transaction if all queries are successful
          connection.release();
          return { message: 'All leave types updated successfully' };
        } catch (err) {
          console.error('Database update error:', err);
          throw err; // Throw error to handle it in the controller
        }
    },

    // Function to add a new leave type
  addLeaveType: async (leaveType) => {
    const query = `
      INSERT INTO hrms.leavetype (leave_type_id, type_name, default_days, pay_grade_id)
      VALUES (?, ?, ?, ?)`;
    
    const params = [
      leaveType.leave_type_id,
      leaveType.type_name,
      leaveType.default_days,
      leaveType.pay_grade_id
    ];
    console.log(params);

    try {
      const [result] = await db.query(query, params); // Execute the SQL insert query
      return result;
    } catch (err) {
      console.error('Model: Error adding leave type:', err);
      throw err;
    }
  },

  // Function to delete a leave type
  deleteLeaveType: async (leaveTypeId) => {
    const query = 'DELETE FROM hrms.leavetype WHERE leave_type_id = ?';

    try {
      const [result] = await db.execute(query, [leaveTypeId]); // Execute the SQL delete query
      return result;
    } catch (err) {
      console.error('Model: Error deleting leave type:', err);
      throw err;
    }
  },

    getLeaveRequestsByEmployeeId: async (employee_id) => {
        const query = `SELECT * FROM leaverequest
        JOIN leavetype ON leavetype.leave_type_id = leaverequest.leave_type_id 
        WHERE employee_id = ? 
        ORDER BY start_date DESC
        LIMIT 10`;
        const [leaveRequests] = await pool.query(query, [employee_id]);
        return leaveRequests;
    },

    getLeaveCountDetails: async (employee_id) => {
        const query = `CALL get_leave_count_details(?);`;
        try {
            const [result] = await pool.query(query, [employee_id]);
            if (!result || result.length === 0) {
                throw new Error('No leave count details found.');
            }
            
            // Return the leave count details from the first row
            return {
                annual_leave_count: result[0][0].annual_leave_count,
                casual_leave_count: result[0][0].casual_leave_count,
                maternity_leave_count: result[0][0].maternity_leave_count,
                nopay_leave_count: result[0][0].nopay_leave_count
            };
        } catch (err) {
            console.error('Error fetching leave count details:', err);
            throw err;  // Optionally propagate the error
        }
    },
  incrementLeaveTypeLeaveCount: async (leave_type_id) => {
      const query = 'UPDATE leavetype SET default_days = default_days + 1 WHERE leave_type_id = ?';
      try {
          await pool.query(query, [leave_type_id]);
      } catch (err) {
          console.error('Error incrementing leave type leave count:', err);
          throw err;
      }
  },
  decrementLeaveTypeLeaveCount: async (leave_type_id) => {
      const query = 'UPDATE leavetype SET default_days = default_days - 1 WHERE leave_type_id = ?';
      try {
          await pool.query(query, [leave_type_id]);
      } catch (err) {
          console.error('Error decrementing leave type leave count:', err);
          throw err;
      }
  },
};

module.exports = leaveModel;
