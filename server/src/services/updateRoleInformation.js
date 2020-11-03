const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const updateRoleInformation = async (
  id,
  role_name,
  detail,
  status,
  permission
) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE role SET 
                        role_name = ${mysql.escape(role_name)},
                        detail = ${mysql.escape(detail)},
                        permission = ${mysql.escape(JSON.stringify(permission))}
                        WHERE id = ${mysql.escape(id)};`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      console.log(result);
      resolve(result);
    });
  });
};

module.exports = updateRoleInformation;
