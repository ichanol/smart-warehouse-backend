const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createNewCurrentProductBalanceRecord = async (
  product_id,
  location,
) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO current_product_balance(product_id, balance, location) 
                  VALUES (
                            (SELECT id FROM product WHERE product_id = ${mysql.escape(product_id)}),
                            0,
                            ${mysql.escape(location)}
                          )`;
    connection.query(SQL, (error, result, field) => {
        console.log(SQL)
        console.log(result)
      if (error) return reject(error);
      resolve(true);
    });
  });
};

module.exports = createNewCurrentProductBalanceRecord;
