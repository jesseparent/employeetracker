require('dotenv').config();
const mysql = require('mysql2');

const database = 'employee_trackerDB'; // Database name

// Generate object containing database connection information 
// Use environment variables for security
const dbConn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: database
};

// Object holding database information
const db = mysql.createConnection(dbConn);

// Connect to database
db.connect(err => {
  if (err) throw err;
});


module.exports = db;