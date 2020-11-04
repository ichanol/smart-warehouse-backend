const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const disableProduct = async (product_id, detail, status) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE product 
                  SET status = (SELECT id FROM product_status WHERE status_value = ${status}),
                      detail = ${mysql.escape(detail)}
                  WHERE product_id = ${mysql.escape(product_id)};`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = disableProduct;
