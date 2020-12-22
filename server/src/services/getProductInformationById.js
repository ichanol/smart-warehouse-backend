const connection = require("../Database_connection/connect")

const getProductInformationById = (productId) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT 
                    product.id, 
                    product.product_name, 
                    product.company_name, 
                    warehouse_stock_area.area_name AS location, 
                    product_status.status_value AS status 
                FROM product 
                INNER JOIN product_status ON product.status = product_status.id
                INNER JOIN warehouse_stock_area ON product.location = warehouse_stock_area.id
                WHERE status = 1 AND product.product_id IN (?)`;
    connection.query(SQL, [productId], (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getProductInformationById;
