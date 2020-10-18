const inquirer = require('inquirer');
const processQuery = require('../db/processQuery');

// Handle all Create/Add operations of our CRUD
const addHandler = (choice, nextAction, db) => {
  // Process the user choice
  switch (choice) {
    case 'Add a department':
      addDepartment(nextAction, db);
      break;
    case 'Add a role':
      addRole(nextAction, db);
      break;
    case 'Add an employee':
      addEmployee(nextAction, db);
      break;
    default:
      console.log('Unrecognized Option!');
      nextAction();
  }
};

// Add a Department
const addDepartment = (nextAction, db) => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?',
      validate: departmentInput => {
        if (departmentInput) {
          return true;
        } else {
          console.log('Please enter a department name!');
          return false;
        }
      }
    }
  ])
    .then(department => {
      const sqlQuery = `INSERT INTO department SET ?;`;
      const successMessage = 'Added "' + department.name + '" to departments';

      processQuery(sqlQuery, nextAction, db, successMessage, department);
    });
};

// Add a Role to a Department
const addRole = (nextAction, db) => {
  // Get the Department list
  db.query('SELECT id, name FROM department', function (err, departmentList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which department would you like to add this role to?',
        choices: departmentList
      },
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the new role?',
        validate: roleInput => {
          if (roleInput) {
            return true;
          } else {
            console.log('Please enter a role name!');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?',
        validate: salaryInput => {
          const salaryAmt = parseInt(salaryInput);
          if (!isNaN(salaryAmt)) {
            return true;
          } else {
            console.log('You must enter a number for the salary!');
            return false;
          }
        }
      }
    ])
      .then(role => {
        // Get Department selected for Role
        const departmentObj = departmentList.filter(dept => dept.name == role.name)[0];

        // Add a Role to the specified Department
        const sqlQuery = `INSERT INTO role SET ?, ?`;
        const parameters = [
          { title: role.title, salary: role.salary },
          { department_id: departmentObj.id }
        ];
        const successMessage = 'Added "' + role.title + '" to roles with a salary of $' + role.salary;
        processQuery(sqlQuery, nextAction, db, successMessage, parameters);
      });
  });
};

// Add an Employee 
const addEmployee = (nextAction, db) => {
  // Get the Role list
  db.query('SELECT id, title AS name FROM role', function (err, roleList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'title',
        message: 'Which role will this employee have?',
        choices: roleList
      },
      {
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of the new employee?',
        validate: firstNameInput => {
          if (firstNameInput) {
            return true;
          } else {
            console.log('Please enter a first name!');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of the new employee?',
        validate: lastNameInput => {
          if (lastNameInput) {
            return true;
          } else {
            console.log('Please enter a last name!');
            return false;
          }
        }
      }
    ])
      .then(employee => {
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
              // Get the role selected
              const roleObj = roleList.filter(role => role.name == employee.title)[0];

              // Add employee with specified manager and role
              const sqlQuery = `INSERT INTO employee SET ?, 
              ?,
              ?`;

              const parameters = [
                { first_name: employee.first_name, last_name: employee.last_name },
                { role_id: roleObj.id },
                { manager_id: managerObj.id }
              ];

              const successMessage = 'Added "' + employee.first_name + ' ' + employee.last_name + '" to employees with a role of ' + employee.title;

              processQuery(sqlQuery, nextAction, db, successMessage, parameters);
            });
        });
      });
  });
};

module.exports = addHandler;