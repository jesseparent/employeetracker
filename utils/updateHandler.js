const inquirer = require('inquirer');
const processQuery = require('../db/processQuery');

// Handle all Update operations of our CRUD
const updateHandler = (choice, nextAction, db) => {
  // Process the user choice
  switch (choice) {
    case 'Update an employee\'s role':
      updateEmployeeRole(nextAction, db);
      break;
    case 'Update an employee\'s manager':
      updateEmployeeManager(nextAction, db);
      break;
    default:
      console.log('Unrecognized Option!');
      nextAction();
  }
};

// Update an Employee's Role
const updateEmployeeRole = (nextAction, db) => {
  db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, employeeList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which employee\'s role would you like to change?',
        choices: employeeList
      }
    ])
      .then(employeeSelection => {
        db.query('SELECT id, title AS name FROM role', function (err, roleList) {
          if (err) throw err;

          inquirer.prompt([
            {
              type: 'list',
              name: 'title',
              message: 'Which role will this employee have?',
              choices: roleList
            }])
            .then(roleSelection => {
              // Get the Employee selected and their ID
              const employeeObj = employeeList.filter(employee => employee.name == employeeSelection.name)[0];
              // Get the Role selected and its ID

              const roleObj = roleList.filter(role => role.name == roleSelection.title)[0];

              // Update the employee's role
              const sqlQuery = `UPDATE employee   
              SET ?
              WHERE ?`;

              const parameters = [
                { role_id: roleObj.id },
                { id: employeeObj.id }
              ];

              const successMessage = 'Updated "' + employeeSelection.name + '" to a role of ' + roleSelection.title;

              processQuery(sqlQuery, nextAction, db, successMessage, parameters);
            });
        });
      });
  });
};

// Update an Employee's Manager
const updateEmployeeManager = (nextAction, db) => {
  db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, employeeList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which employee\'s manager would you like to change?',
        choices: employeeList
      }
    ])
      .then(employeeSelection => {
        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, managerList) {
          if (err) throw err;
          managerList.unshift({ id: null, name: 'None' });
          inquirer.prompt([
            {
              type: 'list',
              name: 'name',
              message: 'Which manager would you like to assign this employee to?',
              choices: managerList
            }
          ])
            .then(managerSelection => {
              // Get the manager selected and their ID
              const managerObj = managerList.filter(manager => manager.name == managerSelection.name)[0];
              // Get the Employee to be edited
              const employeeObj = employeeList.filter(employee => employee.name == employeeSelection.name)[0];

              // Update the Employee's manager
              const sqlQuery = `UPDATE employee   
              SET ?
              WHERE ?`;

              const parameters = [
                { manager_id: managerObj.id },
                { id: employeeObj.id }
              ];

              const successMessage = 'Updated "' + employeeSelection.name + '" to a manager of ' + managerObj.name;

              processQuery(sqlQuery, nextAction, db, successMessage, parameters);
            });
        });
      });
  });
};

module.exports = updateHandler;