const connection = require("../Database_connection/connect");
const mysql = require("mysql");

const getImportExportProductActionType = async (actionId) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT action_type FROM import_export_action WHERE id = ${mysql.escape(
      actionId
    )}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      const [{ action_type }] = result;
      resolve(action_type);
    });
  });
};

module.exports = getImportExportProductActionType;
