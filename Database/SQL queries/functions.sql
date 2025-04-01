
DELIMITER $$
CREATE FUNCTION get_annual_lc(emply_id VARCHAR(50)) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE rem_leave_count INT;
    
    SELECT lc.rem_leave_count 
    INTO rem_leave_count
    FROM leavecount lc JOIN leavetype lt ON lc.leave_type_id=lt.leave_type_id
    WHERE lc.employee_id = emply_id 
    AND lt.type_name = 'Annual Leave';
    
    RETURN rem_leave_count;
    END $$


DELIMITER $$

CREATE FUNCTION get_casual_lc(emply_id VARCHAR(50)) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE rem_leave_count INT;
    
    SELECT lc.rem_leave_count 
    INTO rem_leave_count
    FROM leavecount lc JOIN leavetype lt ON lc.leave_type_id=lt.leave_type_id
    WHERE lc.employee_id = emply_id 
    AND lt.type_name = 'Casual Leave';
    
    RETURN rem_leave_count;
END $$

DELIMITER $$

CREATE FUNCTION get_maternity_lc(emply_id VARCHAR(50)) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE rem_leave_count INT;
    
    SELECT lc.rem_leave_count 
    INTO rem_leave_count
    FROM leavecount lc JOIN leavetype lt ON lc.leave_type_id=lt.leave_type_id
    WHERE lc.employee_id = emply_id 
    AND lt.type_name = 'Maternity Leave';
    
    RETURN rem_leave_count;
END $$

DELIMITER $$

CREATE FUNCTION get_nopay_lc(emply_id VARCHAR(50)) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE rem_leave_count INT;
    
    SELECT lc.rem_leave_count 
    INTO rem_leave_count
    FROM leavecount lc JOIN leavetype lt ON lc.leave_type_id=lt.leave_type_id
    WHERE lc.employee_id = emply_id 
    AND lt.type_name = 'No Pay';
    
    RETURN rem_leave_count;
END $$

DELIMITER $$

CREATE FUNCTION get_attendance_count(p_start_date DATE, p_end_date DATE, p_employee_id VARCHAR(50)) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE present_days INT;
    SELECT COUNT(*) INTO present_days
    FROM attendance 
    WHERE p_employee_id = employee_id 
    AND date BETWEEN p_start_date AND p_end_date 
    AND status = 'Present';
    
    RETURN present_days;
END $$

DELIMITER ;

DELIMITER $$
CREATE FUNCTION is_allowed_leave_type(
    employee_pay_grade_id VARCHAR(50),
    employee_gender ENUM('male', 'female'),
    in_leave_type_id VARCHAR(50)
) RETURNS TINYINT(1)
    READS SQL DATA
BEGIN
    DECLARE constraint_count INT;

    SELECT COUNT(*) INTO constraint_count
    FROM leavetype 
    WHERE leave_type_id = in_leave_type_id
    AND (pay_grade_id = employee_pay_grade_id OR pay_grade_id IS NULL)
    AND ((type_name = 'Maternity Leave' AND employee_gender = 'female') OR type_name != 'Maternity Leave');
    IF constraint_count > 0 THEN
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END$$
