const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createNewRole = async (role_name, detail) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO role(role_name, detail) 
                  VALUES (
                          ${mysql.escape(role_name)},
                          ${mysql.escape(detail)}
                        )`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createNewRole;
