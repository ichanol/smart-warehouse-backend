const connection = require("../Database_connection/connect");

module.exports = getTotalNumberOfRecords = async (
  module,
  joinClause = "",
  whereClause = ""
) => {
  const queryNumberOfRecords = () => {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT COUNT(*) AS numberOfRecords FROM ${module} ${joinClause} ${whereClause}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const numberOfRecords = await queryNumberOfRecords();
  if (numberOfRecords.length >= 1) {
    const [result] = numberOfRecords;
    return result;
  } else {
    return false;
  }
};
