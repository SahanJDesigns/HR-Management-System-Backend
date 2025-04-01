// leaveController.js
const jwt = require('jsonwebtoken');
const leaveModel = require('../models/leaveModle');
const { start } = require('repl');
const { v4: uuidv4 } = require('uuid');
const secretKey = process.env.JWT_SECRET;


const leaveController = {
    getEmployeeLeaves: async (req, res) => {
        try {
            const token = req.cookies['user'];
            if (!token) return res.status(401).json({ message: "No token found" });

            const verified = jwt.verify(token, secretKey);
            if (!verified) return res.status(403).json({ message: "Invalid token" });

            const employee_id = verified.employee_id;

            const employeeLeaves = await leaveModel.getAllEmployeeLeaves(employee_id);

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

            res.status(200).json(processedLeaves);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Invalid token or error fetching data' });
        }
    },

    updateLeaveStatus: async (req, res) => {
        try {
            const token = req.cookies['user'];
            if (!token) return res.status(401).json({ message: "No token found" });

            const verified = jwt.verify(token, secretKey);
            if (!verified) return res.status(403).json({ message: "Invalid token" });

            const { leave_id, status } = req.body;
            await leaveModel.updateLeaveStatus(leave_id, status);

            res.status(200).json({ message: 'Leave status updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Invalid token or error updating leave status' });
        }
    },

    addLeaveRequest: async (req, res) => {
        try {
            const token = req.cookies['user'];
            if (!token) return res.status(401).json({ message: 'No token found' });

            const verified = jwt.verify(token, secretKey);
            const { start_date, end_date, leave_type, description,duration,type_name,request_status} = req.body;
            const formatted_start_date = start_date.split('T')[0];
            const formatted_end_date = end_date.split('T')[0];
            const employee_id = verified.employee_id;
            const leave_id = uuidv4();
            
            await leaveModel.addLeaveRequest(leave_id,employee_id,formatted_start_date,formatted_end_date, leave_type, description);

            res.status(201).json({leave_id,start_date,end_date, leave_type, description,duration,type_name,request_status});
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Invalid token or error adding leave request' });
        }
    },

    deleteLeaveRequest: async (req, res) => {
        try {
            const { leaveId } = req.params;
            await leaveModel.deleteLeaveRequest(leaveId);
            res.status(200).json({ message: 'Leave request deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Invalid token or error deleting leave request' });
        }
    },

    getLeaveTypes: async (req, res) => {
        try {
            const token = req.cookies['user'];
            const leaveTypes = await leaveModel.getLeaveTypes(token);
            res.status(200).json(leaveTypes);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Error fetching leave types' });
        }
    },

    getAllLeaveTypes: async (req, res) => {
        try {
          const leaveTypes = await leaveModel.getAllLeaveTypes();
          res.status(200).json(leaveTypes);
        } catch (err) {
          console.error('Controller: Error fetching leave types:', err);
          res.status(400).json({ error: 'Error fetching leave types' });
        }
    },

    editAllLeaveTypes: async (req, res) => {
        try {
          const updatedLeaveTypes = req.body; // Get updated leave types from request body
          const result = await leaveModel.editAllLeaveTypes(updatedLeaveTypes); // Update the leave types
          res.status(200).json(result); // Return success message
        } catch (err) {
          console.error('Error updating leave types:', err);
          res.status(400).json({ error: 'Error updating leave types' }); // Return error if any issue occurs
        }
    },

    getLeaveRequestOfUser: async (req, res) => {
        try {
            const token = req.cookies['user'];
            if (!token) return res.status(401).json({ message: 'No token found' });

            const verified = jwt.verify(token, secretKey);
            const employee_id = verified.employee_id;

            const leaveRequests = await leaveModel.getLeaveRequestsByEmployeeId(employee_id);

            const processedLeaves = leaveRequests.map(leave => {
                const startDate = new Date(leave.start_date);
                const endDate = new Date(leave.end_date);
                const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)+1);

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
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Error fetching leave requests' });
        }
    },

    getLeaveCountDetails: async (req, res) => {
        try {
            const token = req.cookies['user'];
            if (!token) return res.status(401).json({ message: 'No token found' });

            const verified = jwt.verify(token, secretKey);
            const employee_id = verified.employee_id;
          
            const leaveCountDetails = await leaveModel.getLeaveCountDetails(employee_id);
            // Send the leave count details in the response
            res.status(200).json(leaveCountDetails);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Error fetching leave count details' });
        }
    },

     // Controller to add a new leave type
  addLeaveType: async (req, res) => {
    const leaveType = req.body; // Get data from request body
    try {
      const result = await leaveModel.addLeaveType(leaveType);
      res.status(200).json({ message: 'Leave type added successfully', result });
    } catch (err) {
      console.error('Controller: Error adding leave type:', err);
      res.status(500).json({ error: 'Error adding leave type' });
    }
  },

  // Controller to delete a leave type
  deleteLeaveType: async (req, res) => {
    const { leave_type_id } = req.params; // Get leave_type_id from request parameters
    try {
      const result = await leaveModel.deleteLeaveType(leave_type_id);
      res.status(200).json({ message: 'Leave type deleted successfully', result });
    } catch (err) {
      console.error('Controller: Error deleting leave type:', err);
      res.status(500).json({ error: 'Error deleting leave type' });
    }
  },

    incrementLeaveTypeLeaveCount: async (req, res) => {
        const { leave_type_id } = req.params;
        try {
            await leaveModel.incrementLeaveTypeLeaveCount(leave_type_id);
            res.status(200).json({ message: 'Leave type leave count incremented successfully' });
        } catch (err) {
            console.error('Controller: Error incrementing leave type leave count:', err);
            res.status(500).json({ error: 'Error incrementing leave type leave count' });
        }
    },

    decrementLeaveTypeLeaveCount: async (req, res) => {
        const { leave_type_id } = req.params;
        try {
            await leaveModel.decrementLeaveTypeLeaveCount(leave_type_id);
            res.status(200).json({ message: 'Leave type leave count decremented successfully' });
        } catch (err) {
            console.error('Controller: Error decrementing leave type leave count:', err);
            res.status(500).json({ error: 'Error decrementing leave type leave count' });
        }
    }
    

};

module.exports = leaveController;

