const pool = require('./dbConfig.js');

// Get Job Titles
const getJobTitles = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT job_title_id, name FROM JobTitle');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch job titles' });
  }
};

// Get Pay Grades
const getPayGrades = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT pay_grade_id, grade FROM PayGrade');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pay grades' });
  }
};

// Get Supervisors
const getSupervisors = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT user_id,username,employee_id FROM user where role = 'HR Manager' ||role = 'Admin';
    `);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch supervisors' });
  }
};

// Get Departments
const getDepartments = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT department_id, name FROM Department');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Get Branches
const getBranches = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT branch_id, branch_name FROM Branch');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch branches' });
  }
};

// Export functions
 module.exports = {
  getJobTitles,
  getPayGrades,
  getSupervisors,
  getDepartments,
  getBranches
};
