const connection = require("../Database_connection/connect");

const getPermission = async () => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT id, permission_name, detail FROM permission_list`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getPermission;
