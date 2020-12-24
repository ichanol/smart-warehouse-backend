const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const updateTransactionStatus = async (reference_number, refer) => {
  return new Promise((resolve, reject) => {
    const SQL = `UPDATE inventory_log SET 
                        status = 2,
                        set refer = ${mysql.escape(refer)}
                        WHERE reference_number = ${mysql.escape(
                          reference_number
                        )};`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      console.log(result);
      resolve(result);
    });
  });
};

module.exports = updateTransactionStatus;
