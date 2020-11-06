const connection = require("../Database_connection/connect");

const getRoleName = async () => {
  return new Promise((resolve, reject) => {
    const SQL = "SELECT role_name FROM role";
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getRoleName;
