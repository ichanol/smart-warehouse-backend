const connection = require("../Database_connection/connect");

const insertInformationFromFile = async (data) => {
  return new Promise((resolve, reject) => {
    const SQL =
      "INSERT INTO product (product_id, product_name, company_name,location,detail, status, created_by) VALUES ?";
    connection.query(SQL, [data], (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = insertInformationFromFile;
