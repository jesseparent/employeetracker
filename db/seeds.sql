USE employee_trackerDB;
-- Departments
INSERT INTO department (name)
VALUES ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');
-- Roles
INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, 1),
  ('Sales Lead', 100000, 1),
  ('Software Engineer', 120000, 2),
  ('Lead Engineer', 150000, 2),
  ('Accountant', 125000, 3),
  ('Lawyer', 190000, 4),
  ('Legal Team Lead', 250000, 4);
-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 2, null),
  ('Mike', 'Chan', 1, null),
  ('Ashley', 'Rodriguez', 4, null),
  ('Kevin', 'Tupik', 3, null),
  ('Malia', 'Brown', 5, null),
  ('Sarah', 'Lourd', 7, null),
  ('Tom', 'Allen', 6, null),
  ('Christian', 'Eckenrode', 4, null);
-- Set managers
-- Ashley Rodriquez manages John Doe
UPDATE employee
SET manager_id = 3
WHERE id = 1;
-- John Doe manages Mike Chan
UPDATE employee
SET manager_id = 1
WHERE id = 2;
-- Ashley Rodriquez manages Kevin Tupik
UPDATE employee
SET manager_id = 3
WHERE id = 4;
-- Sarah Lourd manages Tom Allen
UPDATE employee
SET manager_id = 6
WHERE id = 7;
-- Mike Chan manages Christian Eckenrode
UPDATE employee
SET manager_id = 2
WHERE id = 8;