const Dependent = require('../models/dependendModel');
const { v4: uuidv4 } = require('uuid');

// Get all dependents
exports.getAllDependents = async (req, res) => {
    const { employee_id } = req.params;
    try {
        const dependents = await Dependent.getAllDependents(employee_id);
        res.status(200).json(dependents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new dependent
exports.createDependent = async (req, res) => {
    const [employee_id, dependent_name, relationship, gender, is_covered_by_insurance] = req.body;
    const dependent_id = uuidv4();
    try {
        await Dependent.createDependent({ dependent_id, employee_id, dependent_name, relationship, gender, is_covered_by_insurance });
        res.status(201).json({ dependent_id});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a dependent
exports.deleteDependent = async (req, res) => {
    try {
        const deletedDependent = await Dependent.deleteDependent(req.params.dependent_id);
        if (!deletedDependent) {
            return res.status(404).json({ message: 'Dependent not found' });
        }
        res.status(200).json({ message: 'Dependent deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};