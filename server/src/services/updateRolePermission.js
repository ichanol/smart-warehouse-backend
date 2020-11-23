const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const updateRolePermission = async (id, permission) => {
  let whenClause = "";
  permission.map((value) => {
    whenClause =
      whenClause +
      `WHEN permission = '${value.permission}' THEN ${value.status} `;
  });
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE role_permission 
                    SET status = (CASE ${whenClause} END)
                    WHERE role = ${mysql.escape(id)};`;

    connection.query(SQL, (error, result, field) => {
      console.log(SQL);
      console.log(result);
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = updateRolePermission;
