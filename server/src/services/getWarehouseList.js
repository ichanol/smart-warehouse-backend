const connection = require("../Database_connection/connect");

const getWarehouseList = async () => {
  return new Promise((resolve, reject) => {
    const SQL = 'SELECT id, warehouse_name FROM warehouse_list';
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getWarehouseList;
