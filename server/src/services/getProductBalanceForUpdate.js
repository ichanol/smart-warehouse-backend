const connection = require("../Database_connection/connect");

const getProductBalanceForUpdate = async (idForQueryBalance) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT balance FROM current_product_balance WHERE product_id IN (${idForQueryBalance})`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getProductBalanceForUpdate;
