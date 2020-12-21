const connection = require("../Database_connection/connect");

const insertCurrentProductBalanceFromFile = async (data) => {
  return new Promise((resolve, reject) => {
    const SQL =
      "INSERT INTO current_product_balance(product_id, location) VALUES ?";
    connection.query(SQL, [data], (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = insertCurrentProductBalanceFromFile;
