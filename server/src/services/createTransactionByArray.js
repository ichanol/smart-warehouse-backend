const connection = require("../Database_connection/connect");

const createTransactionByArray = async (dataArray) => {
  return new Promise((resolve, reject) => {
    const SQL =
      "INSERT INTO inventory_log(reference_number, product_id, action_type, amount, balance, location, responsable, detail) VALUES ?";
    connection.query(SQL, [dataArray], (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createTransactionByArray;
