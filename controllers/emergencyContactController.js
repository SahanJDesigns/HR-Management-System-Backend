const EmergencyContact = require('../models/emergencyContactModel');
const { v4: uuidv4 } = require('uuid');

// Get all emergency contacts for an employee
exports.getAllEmergencyContacts = async (req, res) => {
    const { employee_id } = req.params;
    try {
        const emergencyContacts = await EmergencyContact.getAllEmergencyContacts(employee_id);
        res.status(200).json(emergencyContacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new emergency contact
exports.createEmergencyContact = async (req, res) => {
    const { employee_id, contact_name, relationship, gender, is_covered_by_insurance } = req.body;
    const contact_id = uuidv4();
    try {
        await EmergencyContact.createEmergencyContact({ contact_id, employee_id, contact_name, relationship, gender, is_covered_by_insurance });
        res.status(201).json({ contact_id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an emergency contact
exports.deleteEmergencyContact = async (req, res) => {
    try {
        const result = await EmergencyContact.deleteEmergencyPerson(req.params.person_id);
        if (!result) {
            return res.status(404).json({ message: 'Emergency contact not found' });
        }
        res.status(200).json({ message: 'Emergency contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
