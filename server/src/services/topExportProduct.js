const connection = require("../Database_connection/connect");

const topExportProduct = async () => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT SUM(amount) AS total, 
                        MAX(product.product_name) AS product_name,
                        product.product_id
                FROM inventory_log_product_list 
                INNER JOIN inventory_log 
                ON inventory_log_product_list.reference_number = inventory_log.id
                INNER JOIN product
                ON inventory_log_product_list.product_id = product.id
                WHERE inventory_log.action_type > 1 
                AND product.status = 1
                GROUP BY product_id 
                ORDER BY total DESC LIMIT 0, 10`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = topExportProduct;
