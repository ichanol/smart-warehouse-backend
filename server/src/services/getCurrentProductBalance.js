const connection = require("../Database_connection/connect");

const getCurrentProductBalance = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT current_product_balance.balance, 
                          current_product_balance.updated_at, 
                          product.product_name, 
                          product.product_id, 
                          product.company_name, 
                          product.status
                  FROM current_product_balance INNER JOIN product
                  ON current_product_balance.product_id = product.id
                  WHERE product.status = 1 ${whereClause} ${orderByClause} ${limitClause}`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
module.exports = getCurrentProductBalance;
