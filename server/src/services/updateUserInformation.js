const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const updateUserInformation = async (
  username,
  firstname,
  lastname,
  role,
  status,
  password,
  id
) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE user SET 
                        username= ${mysql.escape(username)}, 
                        firstname = ${mysql.escape(firstname)},
                        lastname = ${mysql.escape(lastname)},
                        password = ${mysql.escape(password)},
                        role = ${mysql.escape(role)},
                        status = ${mysql.escape(status)} 
                  WHERE id = ${mysql.escape(id)};`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      console.log(result);
      resolve(result);
    });
  });
};

module.exports = updateUserInformation;
