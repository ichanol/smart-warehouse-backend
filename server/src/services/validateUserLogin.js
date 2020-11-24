const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const validateUserLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT username FROM user WHERE username = ${mysql.escape(
      username
    )} AND password = ${mysql.escape(password)} AND status = 1`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = validateUserLogin;
