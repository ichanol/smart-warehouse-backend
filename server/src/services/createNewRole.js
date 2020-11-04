const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createNewRole = async (role_name, detail, permission, status) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO role(role_name, detail, permission, status) 
                  VALUES (
                          ${mysql.escape(role_name)},
                          ${mysql.escape(detail)},
                          ${mysql.escape(JSON.stringify(permission))},
                          (SELECT id FROM role_status WHERE status_value = ${status})
                        )`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createNewRole;
