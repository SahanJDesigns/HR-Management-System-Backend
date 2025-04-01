DELIMITER $$
CREATE TRIGGER update_leave_count
AFTER UPDATE ON leaverequest
FOR EACH ROW
BEGIN
    IF NEW.request_status = 'Approved' THEN
        UPDATE leavecount
        SET rem_leave_count = rem_leave_count - (DATEDIFF(NEW.end_date, NEW.start_date)+1)
        WHERE employee_id = NEW.employee_id 
        AND leave_type_id = NEW.leave_type_id;
    END IF;
END$$

CREATE TRIGGER after_paygrade_insert
AFTER INSERT ON paygrade
FOR EACH ROW
BEGIN
    INSERT INTO leavetype (leave_type_id, type_name, default_days, pay_grade_id)
    VALUES
        (UUID(), 'Casual Leave', 14, NEW.pay_grade_id),
        (UUID(), 'Annual Leave', 21, NEW.pay_grade_id),
        (UUID(), 'Maternity Leave', 90, NEW.pay_grade_id),
        (UUID(), 'No Pay', 0, NEW.pay_grade_id);
END$$
DELIMITER ;

CREATE TRIGGER `update_leavecount_on_paygrade_change` 
AFTER UPDATE ON `employee` 
FOR EACH ROW 
BEGIN
    -- Check if the pay_grade_id has changed, considering NULL values
    IF (OLD.pay_grade_id IS NULL AND NEW.pay_grade_id IS NOT NULL) 
       OR (OLD.pay_grade_id IS NOT NULL AND NEW.pay_grade_id IS NULL) 
       OR (OLD.pay_grade_id != NEW.pay_grade_id) THEN
       
        -- Delete existing leavecount entries for the employee
        DELETE FROM leavecount WHERE employee_id = NEW.employee_id;

        -- Insert new leavecount details based on the new pay_grade_id
        INSERT INTO leavecount (employee_id, leave_type_id, rem_leave_count)
        SELECT 
            NEW.employee_id, 
            lt.leave_type_id, 
            lt.default_days - COALESCE((
                SELECT SUM(rem_leave_count)
                FROM leavecount lc
                WHERE lc.employee_id = NEW.employee_id
                AND lc.leave_type_id = lt.leave_type_id
            ), 0) AS remaining_days
        FROM leavetype lt
        WHERE lt.pay_grade_id = NEW.pay_grade_id;
    END IF;
END;

