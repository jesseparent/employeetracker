-- Drop if database exists, and then Create
DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
-- Use the new Database
USE employee_trackerDB;
-- Department Table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);
-- Role table with foreign key to Department table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
-- Employee table with foreign key to Role table and to itself
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id)
)