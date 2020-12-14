const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const getRoleId = async (roleName) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT id FROM role WHERE role_name = ${mysql.escape(
      roleName
    )}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      const [{ id }] = result;
      resolve(id);
    });
  });
};

module.exports = getRoleId;
