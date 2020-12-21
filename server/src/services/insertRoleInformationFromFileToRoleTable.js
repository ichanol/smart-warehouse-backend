const connection = require("../Database_connection/connect");

const insertRoleInformationFromFileToRoleTable = async (data) => {
  return new Promise((resolve, reject) => {
    const SQL = "INSERT INTO role (role_name, detail, status) VALUES ?";
    connection.query(SQL, data, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = insertRoleInformationFromFileToRoleTable;
