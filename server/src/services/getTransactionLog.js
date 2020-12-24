const connection = require("../Database_connection/connect");

const getTransactionLog = async (
  whereClause = "",
  orderByClause = "",
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT product.id,
                        product.product_id,
                        product.product_name,
                        inventory_log_product_list.amount,
                        inventory_log_product_list.balance,
                        warehouse_stock_area.area_name AS location_name,
                        warehouse_stock_area.id AS location,
                        inventory_log_product_list.detail AS product_detail,
                        inventory_log.refer
                    FROM inventory_log 
                    INNER JOIN import_export_action ON inventory_log.action_type = import_export_action.id 
                    INNER JOIN user ON inventory_log.responsable = user.id
                    INNER JOIN inventory_log_status ON inventory_log.status = inventory_log_status.id
                    INNER JOIN inventory_log_product_list ON inventory_log.id = inventory_log_product_list.reference_number
                    INNER JOIN product ON inventory_log_product_list.product_id = product.id
                    INNER JOIN warehouse_stock_area ON product.location = warehouse_stock_area.id
                    ${whereClause} ORDER BY product.product_id ASC`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getTransactionLog;
