const connection = require("../Database_connection/connect");

const getTotalNumberOfRecordsForTransaction = async (
  whereClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT COUNT(*) AS numberOfRecords 
                    FROM inventory_log 
                        INNER JOIN import_export_action ON inventory_log.action_type = import_export_action.id 
                        INNER JOIN user ON inventory_log.responsable = user.id
                        INNER JOIN inventory_log_status ON inventory_log.status = inventory_log_status.id
                        INNER JOIN inventory_log_product_list ON inventory_log.id = inventory_log_product_list.reference_number
                        INNER JOIN product ON inventory_log_product_list.product_id = product.id 
                        ${whereClause}
                        GROUP BY inventory_log.reference_number`
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result.length);
    });
  });
};

module.exports = getTotalNumberOfRecordsForTransaction;
