const { v4: uuidv4 } = require('uuid');
const departmentModel = require('../models/departmentModel');

exports.getDepartments = async (req, res) => {
    try {
        const departments = await departmentModel.getAllDepartments();
        res.status(200).json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};

exports.getDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await departmentModel.getDepartmentById(id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch department' });
    }
};

exports.addDepartment = async (req, res) => {
    try {
        const { departmentName, branchId } = req.body;
        const departmentId = uuidv4();
        await departmentModel.addDepartment(departmentId, departmentName, branchId);
        res.status(200).json({ message: 'Department added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add department' });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { departmentName, organizationId } = req.body;
        await departmentModel.updateDepartment(id, departmentName, organizationId);
        res.status(200).json({ message: 'Department updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update department' });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        await departmentModel.deleteDepartment(id);
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete department' });
    }
};
