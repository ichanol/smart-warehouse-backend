const connection = require("../Database_connection/connect");

const insertUserInformationFromFileToUserTable = async (data) => {
  return new Promise((resolve, reject) => {
    const SQL =
      "INSERT INTO user (username, firstname, lastname, password, email, role, status, detail) VALUES ?";
    connection.query(SQL, data, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = insertUserInformationFromFileToUserTable;
