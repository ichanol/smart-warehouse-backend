const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const getUserId = async (username) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT id FROM user WHERE username = ${mysql.escape(
      username
    )}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      const [{ id: userId }] = result;
      resolve(userId);
    });
  });
};

module.exports = getUserId;
