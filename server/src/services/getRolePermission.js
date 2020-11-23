const connection = require("../Database_connection/connect");

const getRolePermission = async (
  id = "",
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT 
                  role_permission.permission, 
                  role_permission.status 
                FROM role_permission 
                INNER JOIN role ON role_permission.role = role.id 
                WHERE role.id = ${id}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getRolePermission;
