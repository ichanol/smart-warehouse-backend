const connection = require("../Database_connection/connect");

module.exports = getAll = async (TABLE) => {
  const queryData = () => {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT * FROM ${TABLE}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const result = await queryData();
  if (result.length >= 1) {
    return result;
  } else {
    return false;
  }
};
