const connection = require("../Database_connection/connect");

module.exports = update = async (SQL) => {
  const updateData = () => {
    return new Promise((resolve, reject) => {
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const result = await updateData();
  if (result) {
    return true;
  } else {
    return false;
  }
};
