const inquirer = require('inquirer');
const db = require('./db/database');

const generateMainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'mainChoice',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Quit']
    },
  ])
    .then(menuChoice => {
      if (menuChoice.mainChoice === 'Quit') {
        console.log("GOOD-BYE!");
      }
      else {
        console.log(menuChoice.dbIndex);
        processChoice(menuChoice.mainChoice);
        return generateMainMenu();
      }
    });
};

const processChoice = choice => {
  console.log(choice.dbIndex);
};

// function call to initialize program
generateMainMenu();
