// Process the database query
const processQuery = (sqlQuery, nextAction, db, successMessage, keyValues = {}) => {
  //Execute the SQL Query
  db.query(sqlQuery, keyValues, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    }
    // Display the success message as feedback to the user
    console.log(successMessage);
    nextAction();
  });
};

module.exports = processQuery;