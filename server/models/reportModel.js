const pool = require('../config/dbConfig');

const reports = {
    async getEmployeesGrouped() {
    const query = `
        SELECT 
            d.department_name,
            jt.job_title_name,
            pg.grade AS pay_grade,
            COUNT(e.employee_id) AS employee_count
        FROM 
            department d
        LEFT JOIN 
            employee e ON d.department_id = e.department_id
        LEFT JOIN 
            jobtitle jt ON e.job_title_id = jt.job_title_id
        LEFT JOIN 
            paygrade pg ON e.pay_grade_id = pg.pay_grade_id
        GROUP BY 
            d.department_name, jt.job_title_name, pg.grade
        ORDER BY 
            d.department_name, jt.job_title_name, pg.grade;
        `;
    return pool.query(query);
    },

    // Function to fetch employee count by department
    async getEmployeeCountByDepartment() {
    const query = `
        SELECT d.department_name, COUNT(e.employee_id) AS employee_count
        FROM department d
        JOIN employee e ON d.department_id = e.department_id
        GROUP BY d.department_name;
    `;
    return pool.query(query);
    },

    // Function to fetch employee stats (blood group, nationality, hobbies)
    async getEmployeeStats() {
    const query = `
    SELECT 
        d.department_name AS department,
        SUM(CASE WHEN ca.key_1 = 'Blood Group' AND ca.value_1 = 'A+' THEN 1 ELSE 0 END) AS A_Positive,
        SUM(CASE WHEN ca.key_1 = 'Blood Group' AND ca.value_1 = 'A-' THEN 1 ELSE 0 END) AS A_Negative,
        SUM(CASE WHEN ca.key_1 = 'Blood Group' AND ca.value_1 = 'B+' THEN 1 ELSE 0 END) AS B_Positive,
        SUM(CASE WHEN ca.key_1 = 'Blood Group' AND ca.value_1 = 'B-' THEN 1 ELSE 0 END) AS B_Negative,
        SUM(CASE WHEN ca.key_1 = 'Blood Group' AND ca.value_1 = 'O+' THEN 1 ELSE 0 END) AS O_Positive,
        SUM(CASE WHEN ca.key_1 = 'Blood Group' AND ca.value_1 = 'O-' THEN 1 ELSE 0 END) AS O_Negative,
        SUM(CASE WHEN ca.key_3 = 'Nationality' AND ca.value_3 = 'Pakistani' THEN 1 ELSE 0 END) AS Pakistani,
        SUM(CASE WHEN ca.key_3 = 'Nationality' AND ca.value_3 = 'Sri Lankan' THEN 1 ELSE 0 END) AS SriLankan,
        SUM(CASE WHEN ca.key_3 = 'Nationality' AND ca.value_3 = 'Bangladeshi' THEN 1 ELSE 0 END) AS Bangladeshi,
        SUM(CASE WHEN ca.key_2 = 'Hobbies' AND ca.value_2 = 'Sports' THEN 1 ELSE 0 END) AS Hobbies_Sports,
        SUM(CASE WHEN ca.key_2 = 'Hobbies' AND ca.value_2 = 'Reading' THEN 1 ELSE 0 END) AS Hobbies_Reading,
        SUM(CASE WHEN ca.key_2 = 'Hobbies' AND ca.value_2 = 'Traveling' THEN 1 ELSE 0 END) AS Hobbies_Traveling
    FROM 
        employee e
    JOIN 
        department d ON e.department_id = d.department_id
    JOIN 
        customattribute ca ON e.employee_id = ca.employee_id
    GROUP BY 
        d.department_name;
    `;

    

    return pool.query(query);
    },

    // Function to get total leaves by department
    async  getTotalLeavesByDepartment() {
        const query = `
        SELECT
            MONTH(lr.start_date) AS month,
            d.department_name,
            COUNT(lr.leave_id) AS leave_count
        FROM
            leaverequest lr
        JOIN
            employee e ON lr.employee_id = e.employee_id
        JOIN
            department d ON e.department_id = d.department_id
        GROUP BY
            MONTH(lr.start_date), d.department_name
        ORDER BY
            MONTH(lr.start_date);
        `;

        return pool.query(query);
    },

    async getEmployeeDetails(empId) {
        // Query to get dependents' details
        const dependentsQuery = `
          SELECT 
            dependent_id,
            dependent_name,
            relationship,
            gender,
            is_covered_by_insurance
          FROM 
            employeedependents
          WHERE 
            employee_id = ?;
        `;
    
        // Query to get emergency person details
        const emergencyPersonQuery = `
          SELECT 
            ep.person_name,
            ep.relationship,
            ep.address,
            epc.phone_num
          FROM 
            emergencyperson ep
          LEFT JOIN 
            emergencypersoncontact epc ON ep.person_id = epc.person_id
          WHERE 
            ep.employee_id = ?;
        `;
    
        try {
          const [dependentsResults, emergencyPersonResults] = await Promise.all([
            pool.query(dependentsQuery, [empId]),
            pool.query(emergencyPersonQuery, [empId]),
          ]);
    
          const dependents = dependentsResults[0];
          const emergencyPersons = emergencyPersonResults[0];
    
          return {
            dependents,
            emergencyPersons
          };
        } catch (error) {
          throw new Error('Error fetching employee details: ' + error.message);
        }
      }
}

module.exports = reports;