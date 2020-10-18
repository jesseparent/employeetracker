const inquirer = require('inquirer');

// Handle all Delete operations of our CRUD
const deleteHandler = (choice, nextAction, db) => {
  // Process the user choice
  switch (choice) {
    case 'Delete a department':
      deleteDepartment(nextAction, db);
      break;
    case 'Delete a role':
      deleteRole(nextAction, db);
      break;
    case 'Delete an employee':
      deleteEmployee(nextAction, db);
      break;
    default:
      console.log('Unrecognized Option!');
      nextAction();
  }
};

// Process the database query
const processQuery = (sqlQuery, nextAction, db, successMessage, keyValues = {}) => {
  //Execute the SQL Query
  db.query(sqlQuery, keyValues, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(successMessage);
    nextAction();
  });
};

// Delete a Department
const deleteDepartment = (nextAction, db) => {
  db.query('SELECT id, name FROM department', function (err, departmentList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which department would you like to delete?',
        choices: departmentList
      },
      {
        type: 'confirm',
        name: 'delete',
        message: 'Are you sure you want to delete this department?',
        default: false,
      }
    ])
      .then(departmentSelection => {
        if (departmentSelection.delete) {
          const departmentObj = departmentList.filter(department => department.name == departmentSelection.name)[0];

          const sqlQuery = `DELETE FROM department WHERE ?`;

          const parameters = [
            { id: departmentObj.id }
          ];

          const successMessage = 'Deleted "' + departmentSelection.name + '" from the database';

          processQuery(sqlQuery, nextAction, db, successMessage, parameters);
        }
        else {
          nextAction();
        }
      });
  })
};

// Delete a Role
const deleteRole = (nextAction, db) => {
  db.query('SELECT id, title as name FROM role', function (err, roleList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which role would you like to delete?',
        choices: roleList
      },
      {
        type: 'confirm',
        name: 'delete',
        message: 'Are you sure you want to delete this role?',
        default: false,
      }
    ])
      .then(roleSelection => {
        if (roleSelection.delete) {
          const roleObj = roleList.filter(role => role.name == roleSelection.name)[0];

          const sqlQuery = `DELETE FROM role WHERE ?`;

          const parameters = [
            { id: roleObj.id }
          ];

          const successMessage = 'Deleted "' + roleSelection.name + '" from the database';

          processQuery(sqlQuery, nextAction, db, successMessage, parameters);
        }
        else {
          nextAction();
        }
      });
  })
};

// Delete an Employee
const deleteEmployee = (nextAction, db) => {
  db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, employeeList) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which role would you like to delete?',
        choices: employeeList
      },
      {
        type: 'confirm',
        name: 'delete',
        message: 'Are you sure you want to delete this employee?',
        default: false,
      }
    ])
      .then(employeeSelection => {
        if (employeeSelection.delete) {
          const employeeObj = employeeList.filter(employee => employee.name == employeeSelection.name)[0];
          db.query('UPDATE employee SET manager_id=null WHERE manager_id=' + employeeObj.id, function (err, employeeList) {
            if (err) throw err;

            const sqlQuery = `DELETE FROM employee WHERE ?`;

            const parameters = [
              { id: employeeObj.id }
            ];

            const successMessage = 'Deleted "' + employeeSelection.name + '" from the database';

            processQuery(sqlQuery, nextAction, db, successMessage, parameters);
          });
        }
        else {
          nextAction();
        }
      });
  })
};

module.exports = deleteHandler;