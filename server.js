const inquirer = require('inquirer');
const viewHandler = require('./utils/viewHandler');
const { db, closeDB } = require('./db/database');


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
  'Update an employee role',
  'Quit'];

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

const processChoice = (choice, nextAction) => {
  const crudOperation = choice.split(' ')[0].toLowerCase();
  switch (crudOperation) {
    case 'add':
      console.log('CREATE');
      break;
    case 'view':
      viewHandler(choice, nextAction, db);
      break;
    case 'update':
      console.log('UPDATE');
      break;
    case 'delete':
      console.log('DELETE');
      break;
    default:
      console.log('Invalid Choice');
  }
};

// function call to initialize program
generateMainMenu();
