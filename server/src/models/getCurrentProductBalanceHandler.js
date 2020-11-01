const connection = require("../Database_connection/connect");
const getTotalRecords = require("./getTotalRecords");

const getAllProductBalance = async (whereClause = "", orderByClause = "") => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT current_product_balance.balance, 
                        current_product_balance.location, 
                        current_product_balance.updated_at, 
                        product.product_name, 
                        product.product_id, 
                        product.company_name, 
                        product.status
                FROM current_product_balance INNER JOIN product
                ON current_product_balance.product_id = product.id
                WHERE product.status = 1 ${whereClause} ${orderByClause}`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getCurrentProductBalanceHandler = async (req) => {
  let whereClause = "";
  if (req?.query?.search) {
    whereClause = `AND (
          product.product_name LIKE '%${req?.query.search}%'
          OR product.product_id LIKE '%${req?.query.search}%'
          OR product.company_name LIKE '%${req?.query.search}%'
          )`;
  }
  const temp = await getTotalRecords("current_product_balance");
  const productBalanceResult = await getAllProductBalance(whereClause);

  if (productBalanceResult.length > 0) {
    return productBalanceResult;
  } else {
    return false;
  }
};
