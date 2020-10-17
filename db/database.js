require('dotenv').config();
const mysql = require('mysql2');

const database = 'employee_trackerDB'; // Database name

const dbConn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: database
};

const db = mysql.createConnection(dbConn);

db.connect(err => {
  if (err) throw err;
});


module.exports = db;