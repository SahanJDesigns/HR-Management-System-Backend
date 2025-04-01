
const pool = require('../config/dbConfig');

const enumModel = {

  JOB_TITLES: 'job_titles',
  PAY_GRADES: 'pay_grades',
  SUPERVISORS: 'supervisors',
  DEPARTMENTS: 'departments',
  BRANCHES: 'branches',

  async getJobTitles() {
    try {
      const [result] = await pool.query('SELECT job_title_id,job_title_name FROM JobTitle');
      return result;
    } catch (err) {
      throw new Error('Failed to fetch job titles: ' + err.message);
    }
  },

  // Function to get pay grades
  async getPayGrades() {
    try {
      const [result] = await pool.query('SELECT pay_grade_id, grade FROM PayGrade');
      return result;
    } catch (err) {
      throw new Error('Failed to fetch pay grades: ' + err.message);
    }
  },

  async getSupervisors() {
    try {
      const [result] = await pool.query(`
        SELECT user_id, username, employee_id FROM user WHERE role = 'HR Manager' OR role = 'Admin';
      `);
      return result;
    } catch (err) {
      throw new Error('Failed to fetch supervisors: ' + err.message);
    }
  },

  // Function to get departments
  async getDepartments() {
    try {
      const [result] = await pool.query('SELECT department_id, department_name FROM Department');
      return result;
    } catch (err) {
      throw new Error('Failed to fetch departments: ' + err.message);
    }
  },

  // Function to get branches
  async getBranches() {
    try {
      const [result] = await pool.query('SELECT branch_id, branch_name FROM Branch');
      return result;
    } catch (err) {
      throw new Error('Failed to fetch branches: ' + err.message);
    }
  }
};

module.exports = enumModel;
