const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const disableRole = async (role_name, status) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE role SET status = (SELECT id FROM role_status WHERE status_value = ${mysql.escape(
      status
    )}) WHERE role_name = ${mysql.escape(role_name)};`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = disableRole;
