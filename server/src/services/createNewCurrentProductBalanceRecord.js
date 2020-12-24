const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createNewCurrentProductBalanceRecord = async (product_id) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO current_product_balance(product_id) 
                  VALUES (
                            (SELECT id FROM product WHERE product_id = ${mysql.escape(
                              product_id
                            )})
                          )`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
};

module.exports = createNewCurrentProductBalanceRecord;
