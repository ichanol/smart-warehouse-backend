const connection = require("../Database_connection/connect");

const addRolePermission = async (permission) => {
  return new Promise((resolve, reject) => {
    const SQL =
      "INSERT INTO role_permission(role, permission, status) VALUES ?";

    connection.query(SQL, [permission], (error, result, field) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
};

module.exports = addRolePermission;
