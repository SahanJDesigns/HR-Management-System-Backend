const pool = require('../config/dbConfig');

// Delete a dependent
const deleteDependent = async (dependent_id) => {
    try {
        const query = `DELETE FROM employeedependents WHERE dependent_id = ?`;
        const [results] = await pool.query(query, [dependent_id]);
        return { message: 'Dependent deleted successfully' };
    } catch (err) {
        console.error(err);
        throw { message: 'Error deleting dependent', error: err };
    }
};

const createDependent = async (dependent_id,employee_id,dependent_name,relationship,gender,is_covered_by_insurance) => {
    try {
        const query = `INSERT INTO employeedependents (dependent_id, employee_id, dependent_name,
            relationship, gender, is_covered_by_insurance
            ) VALUES (?, ?, ?, ?, ?, ?)`;
        const [results] = await pool.query(query, [
            dependent_id,
            employee_id,
            dependent_name,
            relationship,
            gender,
            is_covered_by_insurance
        ]);
        return results;
    }
    catch (err) {
        console.error(err);
        throw { message: 'Error creating dependent', error: err };
    }
}

// Get all dependents by employee ID
const getAllDependents = async (employee_id) => {
    try {
        const query = `SELECT * FROM employeedependents WHERE employee_id = ?`;
        const [results] = await pool.query(query, [employee_id]);
        return results;
    } catch (err) {
        console.error(err);
        throw { message: 'Error fetching dependents', error: err };
    }
};

module.exports = {
    createDependent,
    deleteDependent,
    getAllDependents
};