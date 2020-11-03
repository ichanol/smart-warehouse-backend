const connection = require("../Database_connection/connect");

const getProduct = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT product.product_id, 
                        product.product_name, 
                        product.company_name, 
                        product.location, 
                        product.detail, 
                        product.created_at, 
                        product.updated_at, 
                        product_status.status_value AS status,
                        user.firstname AS created_by 
                FROM product INNER JOIN product_status 
                ON product.status = product_status.id 
                INNER JOIN user 
                ON product.created_by = user.id  
                ${whereClause} ${orderByClause} ${limitClause}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getProduct;
