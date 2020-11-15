const connection = require("../Database_connection/connect");

const createTransactionByArray = async (dataArray) => {
  return new Promise((resolve, reject) => {
    const SQL =
      "INSERT INTO inventory_log_product_list(reference_number, product_id, amount, balance, location) VALUES ?";
    connection.query(SQL, [dataArray], (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createTransactionByArray;
