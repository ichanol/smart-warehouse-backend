const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const createTransactionRecord = async (
  referenceNumber,
  actionID,
  userId,
  detail,
) => {
  return new Promise((resolve, reject) => {
    const SQL = `INSERT INTO inventory_log(reference_number, 
                                            action_type, 
                                            responsable, 
                                            detail) 
                VALUES(${mysql.escape(referenceNumber)}, 
                        ${mysql.escape(actionID)}, 
                        ${mysql.escape(userId)}, 
                        ${mysql.escape(detail)})`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = createTransactionRecord;
