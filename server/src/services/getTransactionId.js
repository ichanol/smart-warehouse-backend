const connection = require("../Database_connection/connect");

const getTransactionId = async (referenceNumber) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT id FROM inventory_log WHERE reference_number = ${referenceNumber}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      const [{ id }] = result;
      resolve(id);
    });
  });
};

module.exports = getTransactionId;
