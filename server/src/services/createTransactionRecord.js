const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createTransactionRecord = async (
  referenceNumber,
  actionID,
  userId,
  detail,
  warehouse
) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO inventory_log(reference_number, 
                                            action_type, 
                                            responsable, 
                                            detail, warehouse) 
                VALUES(${mysql.escape(referenceNumber)}, 
                        ${mysql.escape(actionID)}, 
                        ${mysql.escape(userId)}, 
                        ${mysql.escape(detail)},
                        ${mysql.escape(warehouse)})`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createTransactionRecord;
