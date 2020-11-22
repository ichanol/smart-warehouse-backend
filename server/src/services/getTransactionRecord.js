const connection = require("../Database_connection/connect");

const getTransactionRecord = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT inventory_log.reference_number AS reference_number, 
                        MAX(inventory_log.created_at) AS created_at, 
                        MAX(import_export_action.action_name) AS action_name, 
                        MAX(import_export_action.action_type) AS action_type, 
                        MAX(inventory_log.detail) AS detail, 
                        MAX(user.username) AS username,
                        MAX(inventory_log_status.status_value) AS status_value
                  FROM inventory_log
                  INNER JOIN import_export_action ON inventory_log.action_type = import_export_action.id
                  INNER JOIN user ON inventory_log.responsable = user.id
                  INNER JOIN inventory_log_status ON inventory_log.status = inventory_log_status.id
                  INNER JOIN inventory_log_product_list ON inventory_log.id = inventory_log_product_list.reference_number
                  INNER JOIN product ON inventory_log_product_list.product_id = product.id
                  ${whereClause} GROUP BY inventory_log.reference_number ${orderByClause} ${limitClause}`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getTransactionRecord;
