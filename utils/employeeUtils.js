const { v4: uuidv4 } = require('uuid');
const pool = require('../config/dbConfig.js'); 

// Function to insert a new employee
const insertEmployee = async (employeeData) => {
  const sql = `
    INSERT INTO Employee (
      employee_id, first_name, last_name, birth_date, marital_status, NIC_number,
      address, gender, profile_pic
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const employee_id = uuidv4();
  const { firstName, lastName, birthDate, maritalStatus, NIC, address, profilePic, gender } = employeeData;
  
  // Insert main employee record
  await pool.query(sql, [
    employee_id, firstName, lastName, birthDate, maritalStatus, NIC,
    address, gender, profilePic
  ]);

  return employee_id;
};

// Function to insert phone numbers for the employee
const insertPhoneNumbers = async (employee_id, phoneNumbers) => {
  const phoneSql = `
    INSERT INTO employeecontact(employee_id, phone_num) VALUES (?, ?);
  `;
  
  for (const phoneNumber of phoneNumbers) {
    await pool.query(phoneSql, [employee_id, phoneNumber]);
  }
};

// Function to insert custom attributes for the employee
const insertCustomAttributes = async (employee_id, customAttributes) => {
  const customSql = `
    INSERT INTO customattribute (
      employee_id, key_1, value_1, key_2, value_2, key_3, value_3
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  
  // Use null values if certain keys/values are missing
  const [attr1, attr2, attr3] = customAttributes;
  const params = [
    employee_id,
    attr1?.key || null, attr1?.value || null,
    attr2?.key || null, attr2?.value || null,
    attr3?.key || null, attr3?.value || null,
  ];

  // Execute the insert statement
  await pool.query(customSql, params);
};

// Function to create a new employee
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      maritalStatus,
      NIC,
      address,
      gender,
      phoneNumbers, 
      key_1,
      value_1,
      key_2,
      value_2,
      key_3,
      value_3,
    } = req.body;

    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    const newEmployee = {
      firstName,
      lastName,
      birthDate,
      maritalStatus,
      NIC,
      address,
      gender,
      profilePic,
    };

    // Insert main employee and get employee ID
    const employee_id = await insertEmployee(newEmployee);

    // Insert phone numbers
    await insertPhoneNumbers(employee_id, phoneNumbers);

    // Prepare custom attributes
    const customAttributes = [
      { key: key_1, value: value_1 },
      { key: key_2, value: value_2 },
      { key: key_3, value: value_3 },
    ].filter(attr => attr.key && attr.value); // Filter out any empty key-value pairs

    // Insert custom attributes
    await insertCustomAttributes(employee_id, customAttributes);

    res.status(201).json({ employee_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err });
  }
};

// Function to update employee details
const updateEmployeeDetails = async (req, res) => {
  const { employeeId, jobTitleId, payGradeId, supervisorId, departmentId, branchId } = req.body;

  try {
      await pool.query(`
          UPDATE employee
          SET job_title_id = ?, pay_grade_id = ?, supervisor_id = ?, department_id = ?, branch_id = ?
          WHERE employee_id = ?
      `, [jobTitleId, payGradeId, supervisorId, departmentId, branchId, employeeId]);

      return res.status(200).json({ message: 'Employee details updated successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateEmployeePersonalDetails = async (req, res) => {
    const employeeId = req.params.employeeId;
    const {
        firstName,
        lastName,
        birthDate,
        maritalStatus,
        NIC,
        address,
        gender,
    } = req.body;
  
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;
  
    const sqlUpdateQuery = `
        UPDATE employee SET 
            first_name = ?, 
            last_name = ?, 
            birth_date = ?, 
            marital_status = ?, 
            NIC_number = ?, 
            address = ?, 
            gender = ?,
            profile_pic = COALESCE(?, profile_pic) -- Only update if a new file is uploaded
        WHERE employee_id = ?;
    `;
  
    try {
        // Execute the update query
        const result = await pool.query(sqlUpdateQuery, [
            firstName,
            lastName,
            birthDate,
            maritalStatus,
            NIC,
            address,
            gender,
            profilePic,
            employeeId,
        ]);
  
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
  
        res.json({ message: "Employee details updated successfully" });
    } catch (error) {
        console.error("Error updating personal information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
// Exporting the functions to be used in other modules
module.exports = {
  createEmployee,
  updateEmployeeDetails,
  updateEmployeePersonalDetails
};
