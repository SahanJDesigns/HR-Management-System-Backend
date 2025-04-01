DELIMITER $$

CREATE PROCEDURE record_leave_request(
	p_leave_id VARCHAR(50),
    p_employee_id VARCHAR(50),
    p_leave_type_id VARCHAR(50),
    p_start_date DATE,
    p_end_date DATE,
    p_description VARCHAR(255)
)
BEGIN
    INSERT INTO leaverequest (leave_id,employee_id, leave_type_id, start_date, end_date, description, request_status)
    VALUES (p_leave_id,p_employee_id, p_leave_type_id, p_start_date, p_end_date, p_description, 'Pending');
    
    COMMIT;
END$$


CREATE PROCEDURE assign_task(
	p_todo_id VARCHAR(50),
    p_user_id VARCHAR(50),
    p_task VARCHAR(255),
    p_due_date DATE
)
BEGIN
    INSERT INTO todolist (todo_id,user_id, task, due_date, status)
    VALUES (p_todo_id, p_user_id, p_task, p_due_date, 0);
    
    COMMIT;
END$$


CREATE PROCEDURE get_leave_count_details (
    IN emply_id VARCHAR(50)
)
BEGIN
    SELECT
        get_annual_lc(emply_id) AS annual_leave_count,
        get_casual_lc(emply_id) AS casual_leave_count,
        get_maternity_lc(emply_id) AS maternity_leave_count,
        get_nopay_lc(emply_id) AS nopay_leave_count;
END$$


CREATE PROCEDURE employees_count_by_department()
BEGIN
    SELECT d.department_name, COUNT(e.employee_id) AS employee_count
    FROM department d 
    LEFT JOIN employee e ON e.department_id = d.department_id
    GROUP BY d.department_name;
END$$


CREATE PROCEDURE total_leaves_by_department_in_period (
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT d.department_name, SUM(DATEDIFF(lr.end_date, lr.start_date) + 1) AS total_leave_days
    FROM department d 
    LEFT JOIN employee e ON d.department_id = e.department_id
    LEFT JOIN leaverequest lr ON e.employee_id = lr.employee_id
    WHERE 
        (lr.start_date BETWEEN p_start_date AND p_end_date 
        OR lr.end_date BETWEEN p_start_date AND p_end_date)
        AND lr.request_status = 'Approved'
    GROUP BY d.department_name;
END$$


CREATE PROCEDURE get_attendance_count_by_department (
    p_date DATE, 
    p_department_name VARCHAR(50)
)
BEGIN
    SELECT COUNT(*) AS attendance_count
    FROM department d 
    LEFT JOIN employee e ON e.department_id = d.department_id
    LEFT JOIN attendance a ON a.employee_id = e.employee_id
    WHERE d.department_name = p_department_name 
    AND a.date = p_date 
    AND a.status = 'Present';
END$$

create procedure get_employee_details(
    p_employee_id VARCHAR(50)
)
begin
    select 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.gender,
        e.nic_number,
        e.birth_date,
        e.marital_status,
        e.address,
        e.status,
        jt.job_title_name,
        d.department_name,
        b.branch_name,
        pg.grade
    from 
        employee e
    inner join 
        jobtitle jt on e.job_title_id = jt.job_title_id
    inner join 
        department d on e.department_id = d.department_id
    inner join 
        branch b on e.branch_id = b.branch_id
    inner join 
        paygrade pg on e.pay_grade_id = pg.pay_grade_id
    where 
        e.employee_id = p_employee_id;
end $$

DELIMITER ;