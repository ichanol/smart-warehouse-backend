const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createNewProduct = async (
  product_id,
  product_name,
  company_name,
  location,
  detail,
  status,
  username
) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status, created_by) 
                  VALUES (
                            ${mysql.escape(product_id)},
                            ${mysql.escape(product_name)},
                            ${mysql.escape(company_name)},
                            ${mysql.escape(location)},
                            ${mysql.escape(detail)},
                            ${mysql.escape(status)},
                            (SELECT id FROM user WHERE username = ${mysql.escape(username)})
                          )`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createNewProduct;
