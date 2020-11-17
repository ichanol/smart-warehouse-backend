const connection = require("../Database_connection/connect");

const getTransactionLog = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT inventory_log.reference_number,
                        import_export_action.action_name,
                        user.username, 
                        inventory_log.detail, 
                        inventory_log_status.status_value,
                        inventory_log.created_at,
                        product.product_id,
                        product.product_name,
                        inventory_log_product_list.amount,
                        inventory_log_product_list.balance,
                        inventory_log_product_list.location,
                        inventory_log_product_list.detail AS product_detail,
                        import_export_action.action_type
                    FROM inventory_log 
                    INNER JOIN import_export_action ON inventory_log.action_type = import_export_action.id 
                    INNER JOIN user ON inventory_log.responsable = user.id
                    INNER JOIN inventory_log_status ON inventory_log.status = inventory_log_status.id
                    INNER JOIN inventory_log_product_list ON inventory_log.id = inventory_log_product_list.reference_number
                    INNER JOIN product ON inventory_log_product_list.product_id = product.id
                    ${whereClause} ${orderByClause} ${limitClause}`;
    // ${whereClause} AND amount BETWEEN ${amstart} AND ${amend} Order By ${columnName} ${sortDirection}
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getTransactionLog;
