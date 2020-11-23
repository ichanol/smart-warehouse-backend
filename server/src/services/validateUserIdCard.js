const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const validateUserIdCard = async (username) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT username FROM user WHERE username = ${mysql.escape(
      username
    )}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = validateUserIdCard;
