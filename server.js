require('dotenv').config();
const mysql = require('mysql2');

const database = 'ice_creamDB';

// Create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: database
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  afterConnection();
});

afterConnection = () => {
  // Write a simple query that will SELECT everything from the 'products' table
  // Log the results in the console
  //
  const sqlQuery = 'SELECT * FROM products;';
  connection.query(sqlQuery, function (err, result) {
    if (err) throw err;
    console.log(result);
    console.log('Result: ' + JSON.stringify(result));
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);
    }

    connection.end();
  });
  //
  
};
