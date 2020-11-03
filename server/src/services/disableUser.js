const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const disableUser = async (username, detail, status) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE user SET 
                    status = (SELECT id FROM user_status WHERE status_value = ${status}),
                    detail = ${mysql.escape(detail)}
                    WHERE username = ${mysql.escape(username)};`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = disableUser;
