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
                            product.product_id,  
                            product.product_name,
                            inventory_log.amount, 
                            inventory_log.balance, 
                            inventory_log.location, 
                            inventory_log.detail, 
                            inventory_log.created_at,
                            inventory_log_status.status_value
                    FROM inventory_log 
                    INNER JOIN product ON inventory_log.product_id = product.id 
                    INNER JOIN import_export_action ON inventory_log.action_type = import_export_action.id 
                    INNER JOIN user ON inventory_log.responsable = user.id
                    INNER JOIN inventory_log_status ON inventory_log.status = inventory_log_status.id
                    ${whereClause} ${orderByClause} ${limitClause}`;
    // ${whereClause} AND amount BETWEEN ${amstart} AND ${amend} Order By ${columnName} ${sortDirection}
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getTransactionLog;
