const connection = require("../Database_connection/connect");

const getImportExportAction = async (actionId) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT id, action_name FROM import_export_action`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getImportExportAction;
