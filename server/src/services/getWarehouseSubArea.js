const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const getWarehouseSubArea = async (warehouse) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT id, area_name FROM warehouse_stock_area WHERE warehouse = ${mysql.escape(
      warehouse
    )}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getWarehouseSubArea;
