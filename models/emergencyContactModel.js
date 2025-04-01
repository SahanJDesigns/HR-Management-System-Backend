const pool = require('../config/dbConfig');

// Delete a dependent
const deleteEmergencyPerson = async (person_id) => {
    try {
        const query = `DELETE FROM emergencyperson WHERE person_id = ?`;
        const [results] = await pool.query(query, [person_id]);
        return { message: 'Dependent deleted successfully' };
    } catch (err) {
        console.error(err);
        throw { message: 'Error deleting dependent', error: err };
    }
};

// To Do - add phone numners
const createEmergencyPerson = async (person_id,person_name,relationship,address,employee_id) => {
    try {
        const query = `INSERT INTO emergencyperson (person_id, person_name, relationship, address, employee_id
            ) VALUES (?, ?, ?, ?, ?)`;
        const [results] = await pool.query(query, [
            person_id,
            person_name,
            relationship,
            address,
            employee_id
        ]);
        return results;
    }
    catch (err) {
        console.error(err);
        throw { message: 'Error creating dependent', error: err };
    }
}

const getAllEmergencyPerson = async (employee_id) => {
    try {
        const query = `SELECT * FROM emergencyperson WHERE employee_id = ?`;
        const [results] = await pool.query(query, [employee_id]);
        return results;
    } catch (err) {
        console.error(err);
        throw { message: 'Error fetching dependents', error: err };
    }
};

module.exports = {
    createEmergencyPerson,
    deleteEmergencyPerson,
    getAllEmergencyPerson
};