const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const validateUserLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT permission_list.permission_name AS permission, 
                        role_permission.status 
                  FROM user 
                  INNER JOIN role_permission ON user.role = role_permission.role
                  INNER JOIN permission_list ON permission_list.id = role_permission.permission
                  INNER JOIN user_status ON user.status = user_status.id
                  WHERE user.username = ${mysql.escape(
                    username
                  )} AND user.password = ${mysql.escape(password)} AND user_status.status_value = 1`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = validateUserLogin;
