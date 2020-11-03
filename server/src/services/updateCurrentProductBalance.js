const connection = require("../Database_connection/connect");

const updateCurrentProductBalance = async (
  valueToUpdate,
  idForQueryBalance
) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE current_product_balance SET balance = CASE ${valueToUpdate} END WHERE product_id IN (${idForQueryBalance})`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = updateCurrentProductBalance;
