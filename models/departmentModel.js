const pool = require('../config/dbConfig');

const departmentModel = {
  addDepartment: async (departmentId, departmentName, branchId) => {
    await pool.query(
      'INSERT INTO department (department_id, department_name, branch_id) VALUES (?, ?, ?)',
      [departmentId, departmentName, branchId]
    );
  },

  getAllDepartments: async () => {
    const [rows] = await pool.query(`
      SELECT d.department_id, d.department_name, b.branch_name AS branch_name 
      FROM department d
      JOIN branch b ON d.branch_id = b.branch_id
    `);
    return rows;
  },

  getDepartmentById: async (departmentId) => {
    const [rows] = await pool.query(
      'SELECT * FROM department WHERE department_id = ?',
      [departmentId]
    );
    return rows[0];
  },

  updateDepartment: async (departmentId, departmentName, organizationId) => {
    await pool.query(
      'UPDATE department SET department_name = ?, organization_id = ? WHERE department_id = ?',
      [departmentName, organizationId, departmentId]
    );
  },

  deleteDepartment: async (departmentId) => {
    await pool.query('DELETE FROM department WHERE department_id = ?', [departmentId]);
  },
};

module.exports = departmentModel;
