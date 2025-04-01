const db = require('../config/dbConfig'); // Ensure correct import

const payGradeModel = {
  // Function to get all pay grades from the database
  getAllPayGrades: async () => {
    const query = 'SELECT pay_grade_id, grade FROM hrms.paygrade';
    try {
      const [rows] = await db.execute(query); 
      return rows;
    } catch (err) {
      console.error('Model: Error fetching pay grades from the database:', err);
      throw err;
    }
  },

  addPayGrade: async (payGrade) => {
    const query = 'INSERT INTO hrms.paygrade (pay_grade_id, grade) VALUES (?, ?)';
    const params = [payGrade.pay_grade_id, payGrade.grade];
    try {
      const [result] = await db.execute(query, params);
      return result;
    } catch (err) {
      console.error('Error adding pay grade:', err);
      throw err;
    }
  },

  deletePayGrade: async (pay_grade_id) => {
    const query = 'DELETE FROM hrms.paygrade WHERE pay_grade_id = ?';
    try {
      const [result] = await db.execute(query, [pay_grade_id]);
      return result;
    } catch (err) {
      console.error('Error deleting pay grade:', err);
      throw err;
    }
  }
};

module.exports = payGradeModel;
