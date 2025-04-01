const employeeModel = require('../models/employeeModel');

const employeeController = {
  
  async getAllEmployees(req, res) {
    try {
      const employees = await employeeModel.getAllEmployees();
      if (employees.length === 0) {
        return res.status(404).json({ message: 'No employees found' });
      }
      res.status(200).json(employees);
    } catch (error) {
      console.error("Error fetching employees data:", error);
      res.status(500).json({ message: 'Error fetching employees data' });
    }
  },

  addDependent: async function(req, res) {
    try {
        const { dependent_name, relationship, gender, is_covered_by_insurance, employee_id } = req.body;
        const dependentData = { dependent_name, relationship, gender, is_covered_by_insurance, employee_id };

        const result = await employeeModel.addDependent(dependentData);
        res.status(200).json({ message: 'Dependent added successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding dependent', error: error.message });
    }
},
addEmergencyPerson: async function(req, res) {
    const { person_name, relationship, address, employee_id, phone_numbers } = req.body;

    try {
        const personData = { person_name, relationship, address, employee_id };
        await employeeModel.addEmergencyPerson(personData, phone_numbers);
        res.status(200).json({ message: 'Emergency person and contact numbers added successfully' });
    } catch (error) {
        console.error('Error adding emergency person:', error);
        res.status(500).json({ message: 'Failed to add emergency person' });
    }
},
createUser: async function(req, res) {
    const { username, password, role, employee_id } = req.body;

    try {
        const userData = { username, password, role, employee_id };
        await employeeModel.createUser(userData);
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
},
getEmployee: async function(req, res) {
    const employeeId = req.params.employeeId;

    try {
        const rows = await employeeModel.getEmployeeById(employeeId);

        // Process the results
        if (rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const employee = {
            ...rows[0], // Get the employee data from the first row
            phone_numbers: [],
            dependents: [],
            emergency_contacts: [],
        };

        // Loop through the rows to collect contacts, dependents, and emergency contacts
        rows.forEach(row => {
            // Collect phone numbers
            if (row.phone_number) {
                employee.phone_numbers.push(row.phone_number);
            }

            // Collect dependents
            if (row.dependent_name) {
                employee.dependents.push({
                    name: row.dependent_name,
                    relationship: row.dependent_relationship,
                    gender: row.dependent_gender,
                    is_covered_by_insurance: row.is_covered_by_insurance,
                });
            }

            // Collect emergency contacts
            if (row.emergency_contact_name) {
                employee.emergency_contacts.push({
                    name: row.emergency_contact_name,
                    relationship: row.emergency_contact_relationship,
                    address: row.emergency_contact_address,
                    phone_number: row.emergency_phone_number,
                });
            }
        });

        res.json(employee);
    } catch (error) {
        console.error("Error fetching employee data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}, getEmployeePersonal: async function(req, res) {
    const employeeId = req.params.employeeId;

    try {
        // Fetch personal information
        const employeeRows = await employeeModel.getEmployeePersonalInfo(employeeId);
        if (employeeRows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const employee = {
            employee_id: employeeRows[0].employee_id,
            first_name: employeeRows[0].first_name,
            last_name: employeeRows[0].last_name,
            birth_date: employeeRows[0].birth_date,
            marital_status: employeeRows[0].marital_status,
            NIC_number: employeeRows[0].NIC_number,
            address: employeeRows[0].address,
            gender: employeeRows[0].gender,
            profile_pic: `http://localhost:5000${employeeRows[0].profile_pic}`,
            phone_numbers: [],
            custom_attributes: {}
        };

        // Fetch phone numbers
        employee.phone_numbers = await employeeModel.getEmployeePhoneNumbers(employeeId);

        // Fetch custom attributes
        const customAttributeRows = await employeeModel.getEmployeeCustomAttributes(employeeId);
        if (customAttributeRows.length > 0) {
            const attributes = customAttributeRows[0];
            employee.custom_attributes = {
                ...(attributes.key_1 && { [attributes.key_1]: attributes.value_1 }),
                ...(attributes.key_2 && { [attributes.key_2]: attributes.value_2 }),
                ...(attributes.key_3 && { [attributes.key_3]: attributes.value_3 })
            };
        }

        res.json(employee);
    } catch (error) {
        console.error("Error fetching personal information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},async getEmployeeOfficialInfo(req, res) {
    try {
        const employeeId = req.params.employeeId;
        const data = await employeeModel.getOfficialInfo(employeeId);

        if (!data) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const employeeInfo = {
            employee_id: data.employee_id,
            job_title_id: data.job_title_id,
            job_title_name: data.job_title_name,
            pay_grade_id: data.pay_grade_id,
            pay_grade_name: data.pay_grade_name,
            status: data.status,
            supervisor_name: `${data.supervisor_first_name} ${data.supervisor_last_name}`,
            department_id: data.department_id,
            department_name: data.department_name,
            branch_id: data.branch_id,
            branch_name: data.branch_name
        };

        res.json(employeeInfo);
    } catch (error) {
        console.error("Error fetching official information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},

async getEmployeeDependents(req, res) {
    try {
        const employeeId = req.params.employeeId;
        const dependents = await employeeModel.getDependents(employeeId);
        res.json(dependents);
    } catch (error) {
        console.error("Error fetching dependents information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},

async getEmployeeEmergencyContacts(req, res) {
    try {
        const employeeId = req.params.employeeId;
        const contacts = await employeeModel.getEmergencyContacts(employeeId);

        const emergencyContacts = contacts.reduce((acc, row) => {
            let contact = acc.find(
                contact => contact.name === row.name && 
                           contact.relationship === row.relationship && 
                           contact.address === row.address
            );
            
            if (!contact) {
                contact = {
                    person_id: row.person_id,
                    name: row.name,
                    relationship: row.relationship,
                    address: row.address,
                    phone_numbers: []
                };
                acc.push(contact);
            }
            contact.phone_numbers.push(row.phone_number);
            return acc;
        }, []);
        console.log(emergencyContacts);
        res.json(emergencyContacts);
    } catch (error) {
        console.error("Error fetching emergency contact information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},

};

module.exports = employeeController;
