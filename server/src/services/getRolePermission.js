const connection = require("../Database_connection/connect");

const getRolePermission = async (id = "") => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT 
                  role_permission.permission AS id, 
                  role_permission.status,
                  permission_list.permission_name,
                  permission_list.detail 
                FROM role_permission 
                INNER JOIN role ON role_permission.role = role.id 
                INNER JOIN permission_list ON role_permission.permission = permission_list.id 
                WHERE role.id = ${id}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getRolePermission;
