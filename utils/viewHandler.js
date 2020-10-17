const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('../db/database');

// Handle all Read/View operations of our CRUD
const viewHandler = (choice, nextAction) => {
  let sqlQuery = null;

  // Generate the SQL Query based on the user choice
  switch (choice) {
    case 'View all departments':
      sqlQuery = `SELECT * FROM department;`;
      break;
    case 'View all roles':
      sqlQuery = `SELECT r.id, r.title, r.salary, d.name AS department
      FROM role r
      JOIN department d ON d.id = r.department_id
      ORDER BY r.id ASC;`;
      break;
    case 'View all employees':
      sqlQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
      FROM employee e
      LEFT JOIN employee e2 ON e2.id = e.manager_id
      JOIN role r ON r.id = e.role_id
      JOIN department d ON d.id = r.department_id
      ORDER BY e.id ASC`;
      break;
    case 'View all employees by manager':
      viewEmployeesByManager(nextAction);
      break;
    case 'View all employees by department':
      viewEmployeesByDepartment(nextAction);
      break;
    case 'View total utilized budget by department':
      viewBudgets(nextAction);
      break;
    default:
      console.log('Unrecognized Option!');
      nextAction();
  }

  // Execute the SQL Query
  if (sqlQuery) {
    db.query(sqlQuery, function (err, result) {
      if (err) throw err;
      console.table(result);
      nextAction();
    });
  }
};

const viewEmployeesByManager = (nextAction) => {
  // Get the Employee list
  db.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, result) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which manager would you like to view the employees for?',
        choices: result
      }
    ])
      .then(manager => {
        const [firstName, lastName] = manager.name.split(' ');
        const nameColumns = [{
          first_name: firstName
        },
        {
          last_name: lastName
        }];
        const sqlQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
        FROM employee e
        LEFT JOIN employee e2 ON e2.id = e.manager_id
        JOIN role r ON r.id = e.role_id
        JOIN department d ON d.id = r.department_id
        WHERE e.manager_id =
        (SELECT id FROM employee WHERE ? AND ?) 
        ORDER BY e.id ASC`;

        //Execute the SQL Query
        db.query(sqlQuery, nameColumns, function (err, result) {
          if (err) throw err;
          console.table(result);
          nextAction();
        });
      });
  });
};

const viewEmployeesByDepartment = (nextAction) => {
  // Get the Department list
  db.query('SELECT name FROM department', function (err, result) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which department would you like to view the employees for?',
        choices: result
      }
    ])
      .then(department => {
        const sqlQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
        FROM employee e
        LEFT JOIN employee e2 ON e2.id = e.manager_id
        JOIN role r ON r.id = e.role_id
        JOIN department d ON d.id = r.department_id
        WHERE ?
        ORDER BY e.id ASC`;

        //Execute the SQL Query
        db.query(sqlQuery, department, function (err, result) {
          if (err) throw err;
          console.table(result);
          nextAction();
        });
      });
  });
};

const viewBudgets = (nextAction) => {
  // Get the Department list
  db.query('SELECT name FROM department', function (err, result) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which department would you like to view the budget for?',
        choices: result
      }
    ])
      .then(department => {
        const sqlQuery = `SELECT d.name AS department, SUM(r.salary) AS "total utilized budget"
        FROM department d
        JOIN role r ON r.department_id = d.id
        WHERE ?
        GROUP BY d.name
        ORDER BY 2 ASC;`;

        //Execute the SQL Query
        db.query(sqlQuery, department, function (err, result) {
          if (err) throw err;
          console.table(result);
          nextAction();
        });
      });
  });
};

module.exports = viewHandler