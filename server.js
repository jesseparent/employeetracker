const inquirer = require('inquirer');
const db = require('./db/database');

afterConnection = () => {
  // Write a simple query that will SELECT everything from the 'products' table
  // Log the results in the console
  //
  const sqlQuery = 'SELECT * FROM products;';
  db.query(sqlQuery, function (err, result) {
    if (err) throw err;
    console.log(result);

    db.end();
  });
}
afterConnection();