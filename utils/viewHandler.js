const cTable = require('console.table');
const db = require('../db/database');

// Handle all Read/View operations of our CRUD
const viewHandler = (choice, nextAction) => {
  let sqlQuery = '';

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
      sqlQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
      FROM employee e
      LEFT JOIN employee e2 ON e2.id = e.manager_id
      JOIN role r ON r.id = e.role_id
      JOIN department d ON d.id = r.department_id
      ORDER BY e.id ASC`;
      break;
    default:
      console.log('Unrecognized Option!');
      nextAction();
  }

  // Execute the SQL Query
  db.query(sqlQuery, function (err, result) {
    if (err) throw err;
    console.table(result);
    nextAction();
  });
};

module.exports = viewHandler