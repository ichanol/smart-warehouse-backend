const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const updateProductInformation = async (
  product_id,
  product_name,
  company_name,
  location,
  detail,
  status
) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE product SET 
    product_id = ${mysql.escape(product_id)},
    product_name = ${mysql.escape(product_name)},
    company_name = ${mysql.escape(company_name)},
    location = ${mysql.escape(location)},
    detail = ${mysql.escape(detail)},
    status = (SELECT id FROM product_status WHERE status_value = ${status})
    WHERE product_id = ${mysql.escape(product_id)};`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      console.log(result);
      resolve(result);
    });
  });
};

module.exports = updateProductInformation;
