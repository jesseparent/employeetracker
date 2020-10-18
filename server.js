const inquirer = require('inquirer');
const addHandler = require('./utils/addHandler');
const viewHandler = require('./utils/viewHandler');
const updateHandler = require('./utils/updateHandler');
const deleteHandler = require('./utils/deleteHandler');
const db = require('./db/database');

// Inquirer choices for main menu
const mainChoices = [
  'View all departments',
  'View all roles',
  'View all employees',
  'View all employees by manager',
  'View all employees by department',
  'View total utilized budget by department',
  'Add a department',
  'Add a role',
  'Add an employee',
  'Update an employee\'s role',
  'Update an employee\'s manager',
  'Delete a department',
  'Delete a role',
  'Delete an employee',
  'Quit'];

// Generate the main menu for user to make selections
const generateMainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'mainChoice',
      message: 'What would you like to do?',
      choices: mainChoices
    },
  ])
    .then(menuChoice => {
      if (menuChoice.mainChoice === 'Quit') {
        db.end();
        console.log("GOOD-BYE!");
      }
      else {
        processChoice(menuChoice.mainChoice, generateMainMenu);
      }
    });
};

// Process which CRUD operation the user chose to make and pass it on to the right handler
const processChoice = (choice, nextAction) => {
  const crudOperation = choice.split(' ')[0].toLowerCase();
  switch (crudOperation) {
    case 'add':
      addHandler(choice, nextAction, db);
      break;
    case 'view':
      viewHandler(choice, nextAction, db);
      break;
    case 'update':
      updateHandler(choice, nextAction, db);
      break;
    case 'delete':
      deleteHandler(choice, nextAction, db);
      break;
    default:
      console.log('Invalid Choice');
  }
};

// function call to initialize program
generateMainMenu();
