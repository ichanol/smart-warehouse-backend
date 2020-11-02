const connection = require("../Database_connection/connect");

module.exports = getTotalNumberOfRecords = async (
  module,
  joinClause = "",
  whereClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT COUNT(*) AS numberOfRecords FROM ${module} ${joinClause} ${whereClause}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      const [{ numberOfRecords }] = result;
      resolve(numberOfRecords);
    });
  });
};
