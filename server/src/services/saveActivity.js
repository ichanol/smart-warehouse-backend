const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const saveActivity = async (user, activity, detail) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO activity_log(user, activity, detail) VALUES(${mysql.escape(
      user
    )}, ${mysql.escape(activity)}, ${mysql.escape(detail)})`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = saveActivity;
