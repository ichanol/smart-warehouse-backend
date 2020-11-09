const connection = require("../Database_connection/connect");

const getEmail = async () => {
  return new Promise((resolve, reject) => {
    const SQL =
      "SELECT email FROM user WHERE role IN (SELECT id FROM role WHERE role_name IN ('Admin', 'Reporter'))";
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      const temp = result.map((value) => value.email);
      resolve(temp);
    });
  });
};

module.exports = getEmail;
