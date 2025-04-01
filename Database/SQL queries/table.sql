drop database hrms;
-- table creation queries
create database hrms;
use hrms;
CREATE TABLE organization (
    organization_id VARCHAR(50) PRIMARY KEY,
    organization_name VARCHAR(50),
    address VARCHAR(100),
    registration_number VARCHAR(50),
    latitude DECIMAL(10,0),
    longitude DECIMAL(10,0)
);

CREATE TABLE paygrade (
    pay_grade_id VARCHAR(50) PRIMARY KEY,
    grade VARCHAR(50)
);

CREATE TABLE jobtitle (
    job_title_id VARCHAR(50) PRIMARY KEY,
    job_title_name VARCHAR(50)
);

CREATE TABLE branch (
    branch_id VARCHAR(50) PRIMARY KEY,
    branch_name VARCHAR(50),
    address VARCHAR(100)
);

CREATE TABLE department (
    department_id VARCHAR(50) PRIMARY KEY,
    department_name VARCHAR(50),
    branch_id VARCHAR(50),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)

);
CREATE TABLE employee (
    employee_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birth_date DATE,
    marital_status VARCHAR(50),
    NIC_number VARCHAR(50),
    address VARCHAR(50),
    status ENUM('Intern parttime','Intern fultime','Contract parttime','Contract fultime','Permanent','Freelance'),
    job_title_id VARCHAR(50),
    pay_grade_id VARCHAR(50),
    supervisor_id VARCHAR(50),
    department_id VARCHAR(50),
    profile_pic VARCHAR(50),
    branch_id VARCHAR(50),
    gender ENUM('male', 'female'),
    FOREIGN KEY (job_title_id) REFERENCES jobtitle(job_title_id),
    FOREIGN KEY (pay_grade_id) REFERENCES paygrade(pay_grade_id),
    FOREIGN KEY (supervisor_id) REFERENCES employee(employee_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

CREATE TABLE customattribute (
    employee_id VARCHAR(50) PRIMARY KEY,
    key_1 VARCHAR(50),
    value_1 VARCHAR(50),
    key_2 VARCHAR(50),
    value_2 VARCHAR(50),
    key_3 VARCHAR(50),
    value_3 VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE emergencyperson (
    person_id VARCHAR(50) PRIMARY KEY,
    person_name VARCHAR(50),
    relationship VARCHAR(50),
    address VARCHAR(100),
    employee_id VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE emergencypersoncontact (
    phone_num VARCHAR(50) PRIMARY KEY,
    person_id VARCHAR(50),
    FOREIGN KEY (person_id) REFERENCES emergencyperson(person_id)
);

CREATE TABLE employeecontact (
    phone_num VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE employeedependents (
    dependent_id VARCHAR(50) PRIMARY KEY,
    dependent_name VARCHAR(50),
    relationship VARCHAR(50),
    gender VARCHAR(50),
    is_covered_by_insurance TINYINT(1),
    employee_id VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE attendance (
    attendance_id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50),
    date DATE,
    status ENUM('Present', 'Absent', 'Leave'),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE leavetype (
    leave_type_id VARCHAR(50) PRIMARY KEY,
    type_name ENUM('Casual Leave', 'Annual Leave', 'Maternity Leave', 'No Pay'),
    default_days INT,
    pay_grade_id VARCHAR(50),
    FOREIGN KEY (pay_grade_id) REFERENCES paygrade(pay_grade_id)
);

CREATE TABLE leaverequest (
    leave_id VARCHAR(50) PRIMARY KEY,
    start_date DATE,
    end_date DATE,
    description VARCHAR(255),
    request_status ENUM('Pending', 'Approved', 'Rejected'),
    employee_id VARCHAR(50),
    leave_type_id VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES leavetype(leave_type_id)
);


CREATE TABLE leavecount (
    employee_id VARCHAR(50),
    leave_type_id VARCHAR(50),
    rem_leave_count INT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES leavetype(leave_type_id)
);

CREATE TABLE user (
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),
    role ENUM('Admin', 'HR Manager', 'Employee', 'Supervisor'),
    employee_id VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    message VARCHAR(255),
    date DATE,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE todolist (
    todo_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    task VARCHAR(255),
    due_date DATE,
    status TINYINT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
