const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const updateUserInformation = async (
  username,
  firstname,
  lastname,
  email,
  role,
  detail,
  id
) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE user SET 
                        username= ${mysql.escape(username)}, 
                        firstname = ${mysql.escape(firstname)},
                        lastname = ${mysql.escape(lastname)},
                        email = ${mysql.escape(email)},
                        role = (SELECT id FROM role WHERE role_name = ${mysql.escape(role)}),
                        detail = ${mysql.escape(detail)}
                  WHERE id = ${mysql.escape(id)};`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = updateUserInformation;
