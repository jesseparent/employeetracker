const cTable = require('console.table');
const inquirer = require('inquirer');

// Handle all Read/View operations of our CRUD
const viewHandler = (choice, nextAction, db) => {
  let sqlQuery = null;

  // Generate the SQL Query based on the user choice
  switch (choice) {
    case 'View all departments':
      viewDepartments(nextAction, db);
      break;
    case 'View all roles':
      viewRoles(nextAction, db);
      break;
    case 'View all employees':
      viewEmployees(nextAction, db);
      break;
    case 'View all employees by manager':
      viewEmployeesByManager(nextAction, db);
      break;
    case 'View all employees by department':
      viewEmployeesByDepartment(nextAction, db);
      break;
    case 'View total utilized budget by department':
      viewBudgets(nextAction, db);
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

// Process the database query
const processQuery = (sqlQuery, nextAction, db, keyValues = {}) => {
  //Execute the SQL Query
  db.query(sqlQuery, keyValues, function (err, result) {
    if (err) throw err;
    console.table(result);
    nextAction();
  });
}

// View all Departments
const viewDepartments = (nextAction, db) => {
  const sqlQuery = `SELECT * FROM department;`;

  processQuery(sqlQuery, nextAction, db);
};

// View all Roles
const viewRoles = (nextAction, db) => {
  sqlQuery = `SELECT r.id, r.title, r.salary, d.name AS department
      FROM role r
      JOIN department d ON d.id = r.department_id
      ORDER BY r.id ASC;`;

  processQuery(sqlQuery, nextAction, db);
};

// View all Employees
const viewEmployees = (nextAction, db) => {
  sqlQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
      FROM employee e
      LEFT JOIN employee e2 ON e2.id = e.manager_id
      JOIN role r ON r.id = e.role_id
      JOIN department d ON d.id = r.department_id
      ORDER BY e.id ASC`;

  processQuery(sqlQuery, nextAction, db);
};

// View all Employees reporting to a specific manager
const viewEmployeesByManager = (nextAction, db) => {
  // Get the Employee list
  const currentManagersQuery = `SELECT DISTINCT CONCAT(e2.first_name, " ", e2.last_name) AS name
  FROM employee e1
  JOIN employee e2 WHERE e2.id = e1.manager_id
  ORDER BY e2.first_name`;

  db.query(currentManagersQuery, function (err, result) {
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

        processQuery(sqlQuery, nextAction, db, nameColumns);
      });
  });
};

// View all Employees in a Department
const viewEmployeesByDepartment = (nextAction, db) => {
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

        processQuery(sqlQuery, nextAction, db, department);
      });
  });
};

// View Budget for a specific Department
const viewBudgets = (nextAction, db) => {
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

        processQuery(sqlQuery, nextAction, db, department);
      });
  });
};

module.exports = viewHandler