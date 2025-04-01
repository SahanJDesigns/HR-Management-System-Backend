const pool = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const employeeModel = {

  getAllEmployees: async() => {
    const [result] = await pool.query('SELECT * FROM employee');
    return result;
  },

  addDependent: async function(dependentData) {
    const dependent_id = uuidv4();
    const query = `INSERT INTO employeedependents (dependent_id, dependent_name, relationship, gender, is_covered_by_insurance, employee_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [dependent_id, dependentData.dependent_name, dependentData.relationship, dependentData.gender, dependentData.is_covered_by_insurance, dependentData.employee_id];
    const [result] = await pool.query(query, values);
    return result;
 },

 addEmergencyPerson: async function(personData, phoneNumbers) {
  const person_id = uuidv4();

  // Insert into emergencyperson table
  const queryPerson = `INSERT INTO emergencyperson (person_id, person_name, relationship, address, employee_id) 
                       VALUES (?, ?, ?, ?, ?)`;
  const valuesPerson = [person_id, personData.person_name, personData.relationship, personData.address, personData.employee_id];

  try {
      const [personResult] = await pool.query(queryPerson, valuesPerson);

      // Insert into emergencypersoncontact table
      const insertPromises = phoneNumbers.map(phone_num => {
          return pool.query(
              `INSERT INTO emergencypersoncontact (phone_num, person_id) VALUES (?, ?)`,
              [phone_num, person_id]
          );
      });

      await Promise.all(insertPromises);
      return personResult; // Return the result of the person insert
  } catch (error) {
      throw error; // Propagate the error to the controller
  }
},

createUser: async function(userData) {
  const user_id = uuidv4();
  const hashed_password = await bcrypt.hash(userData.password, 10);
  const query = `INSERT INTO user (user_id, username, password_hash, role, employee_id) VALUES (?, ?, ?, ?, ?)`;
  const values = [user_id, userData.username, hashed_password, userData.role, userData.employee_id];

  try {
      await pool.query(query, values);
      return user_id; // Return the new user ID if needed
  } catch (error) {
      throw error; // Propagate the error to the controller
  }
},

getEmployeeById: async function(employeeId) {
  const sqlQuery = `
      SELECT 
          e.employee_id,
          e.first_name,
          e.last_name,
          e.birth_date,
          e.marital_status,
          e.NIC_number,
          e.address,
          e.status,
          e.gender,
          e.profile_pic,
          e.supervisor_id,
          e.job_title_id,
          e.pay_grade_id,
          e.department_id,
          e.branch_id,
          ep.phone_num AS phone_number,
          dep.dependent_name AS dependent_name,
          dep.relationship AS dependent_relationship,
          dep.gender AS dependent_gender,
          dep.is_covered_by_insurance,
          emg.person_name AS emergency_contact_name,
          emg.relationship AS emergency_contact_relationship,
          emg.address AS emergency_contact_address,
          ep_contact.phone_num AS emergency_phone_number
      FROM 
          employee e
      LEFT JOIN 
          employeecontact ep ON e.employee_id = ep.employee_id
      LEFT JOIN 
          employeedependents dep ON e.employee_id = dep.employee_id
      LEFT JOIN 
          emergencyperson emg ON e.employee_id = emg.employee_id
      LEFT JOIN 
          emergencypersoncontact ep_contact ON emg.person_id = ep_contact.person_id
      WHERE 
          e.employee_id = ?;
  `;

  const [rows] = await pool.query(sqlQuery, [employeeId]);
  return rows;
},

getEmployeePersonalInfo: async function(employeeId) {
  const sqlEmployeeQuery = `
      SELECT employee_id, first_name, last_name, birth_date, marital_status, NIC_number, 
             address, gender, profile_pic
      FROM employee 
      WHERE employee_id = ?;
  `;
  const [employeeRows] = await pool.query(sqlEmployeeQuery, [employeeId]);
  return employeeRows;
},

getEmployeePhoneNumbers: async function(employeeId) {
  const sqlContactQuery = `SELECT phone_num FROM employeecontact WHERE employee_id = ?;`;
  const [contactRows] = await pool.query(sqlContactQuery, [employeeId]);
  return contactRows.map(row => row.phone_num);
},

getEmployeeCustomAttributes: async function(employeeId) {
  const sqlCustomAttributeQuery = `
      SELECT key_1, value_1, key_2, value_2, key_3, value_3 
      FROM customattribute 
      WHERE employee_id = ?;
  `;
  const [customAttributeRows] = await pool.query(sqlCustomAttributeQuery, [employeeId]);
  return customAttributeRows;
},async getOfficialInfo(employeeId) {
  const sqlQuery = `
      SELECT 
          e.employee_id, jt.job_title_id, jt.job_title_name, 
          pg.pay_grade_id, pg.grade AS pay_grade_name, 
          e.status, sup.first_name AS supervisor_first_name,
          sup.last_name AS supervisor_last_name, d.department_id, 
          d.department_name, b.branch_id, b.branch_name
      FROM employee e
      LEFT JOIN jobtitle jt ON e.job_title_id = jt.job_title_id
      LEFT JOIN paygrade pg ON e.pay_grade_id = pg.pay_grade_id
      LEFT JOIN department d ON e.department_id = d.department_id
      LEFT JOIN branch b ON e.branch_id = b.branch_id
      LEFT JOIN employee sup ON e.supervisor_id = sup.employee_id
      WHERE e.employee_id = ?;
  `;
  const [rows] = await pool.query(sqlQuery, [employeeId]);
  return rows[0] || null;
},

async getDependents(employeeId) {
  const sqlQuery = `
      SELECT dependent_name AS name, relationship, gender, is_covered_by_insurance
      FROM employeedependents WHERE employee_id = ?;
  `;
  const [rows] = await pool.query(sqlQuery, [employeeId]);
  return rows;
},async getEmergencyContacts(employeeId) {
  const sqlQuery = `
      SELECT emergencyperson.person_id, person_name AS name, relationship, address, phone_num AS phone_number
      FROM emergencyperson 
      JOIN emergencypersoncontact ON emergencyperson.person_id = emergencypersoncontact.person_id
      WHERE employee_id = ?;
  `;
  const [rows] = await pool.query(sqlQuery, [employeeId]);
  return rows;
},
};

module.exports = employeeModel;
