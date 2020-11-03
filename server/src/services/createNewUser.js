const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createNewUser = async (
  username,
  firstname,
  lastname,
  password,
  role,
  status
) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO user(username, firstname, lastname, password, role, status) VALUES(
        ${mysql.escape(username)},
        ${mysql.escape(firstname)},
        ${mysql.escape(lastname)},
        ${mysql.escape(password)},
        ${mysql.escape(role)},
        ${mysql.escape(status)}
        )`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createNewUser;
