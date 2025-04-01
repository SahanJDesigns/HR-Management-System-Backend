create view EmployeeDetails as
select e.first_name, e.last_name, j.job_title_name, d.department_name, b.branch_name 
from employee e join jobtitle j on e.job_title_id = j.job_title_id
	        join department d on e.department_id = d.department_id
                join branch b on e.branch_id = b.branch_id;


create view rem_leave_count as
select e.first_name, e.last_name, lt.type_name, lc.rem_leave_count
from employee e join leavecount lc on e.employee_id = lc.employee_id
	        join leavetype lt on lc.leave_type_id = lt.leave_type_id;

create view user_info as
select 
    u.user_id,
    u.username,
    u.role,
    e.first_name,
    e.last_name,
    e.nic_number,
    e.birth_date,
    e.marital_status,
    e.address as employee_address,
    e.status as employment_status,
    e.gender,
    j.job_title_name,
    d.department_name,
    b.branch_name
from 
    user u
join 
    employee e on u.employee_id = e.employee_id
join 
    jobtitle j on e.job_title_id = j.job_title_id
join 
    department d on e.department_id = d.department_id
join 
    branch b on e.branch_id = b.branch_id;


create view leave_requests_info as
select 
    lr.leave_id,
    e.first_name,
    e.last_name,
    lt.type_name,
    lr.start_date,
    lr.end_date,
    lr.description,
    lr.request_status as leave_status
from 
    leaverequest lr
join 
    employee e on lr.employee_id = e.employee_id
join 
    leavetype lt on lr.leave_type_id = lt.leave_type_id;



create view department_employee_count as
select 
    d.department_name,
    count(e.employee_id) as employee_count
from 
    department d
left join 
    employee e on d.department_id = e.department_id
group by 
    d.department_name;


create view employee_emergency_contact as
select 
    e.employee_id,
    e.first_name,
    e.last_name,
    ep.person_name,
    epc.phone_num,
    ep.relationship
from 
    employee e
join 
    emergencyperson ep on e.employee_id = ep.employee_id
join 
    emergencypersoncontact epc on ep.person_id = epc.person_id;