module.exports = searchTransactionLog = async (
  mysql,
  connection,
  filterArr,
  startDate,
  endDate
) => {
  const queryData = () => {
    return new Promise((resolve, reject) => {
      let whereClause;

      const filter = filterArr.filter((value) => value.value !== null);

      if (filter.length >= 1) {
        filter.map((value, key) => {
          if (key === 0) {
            whereClause = ` WHERE ${value.str} = ${mysql.escape(value.value)}`;
          } else {
            whereClause =
              whereClause + ` AND ${value.str} = ${mysql.escape(value.value)}`;
          }
        });
      }
      if (startDate && endDate) {
        whereClause = `${
          whereClause ? whereClause + " AND" : " WHERE"
        } timestamp BETWEEN ${mysql.escape(
          startDate + " 00:00:00"
        )} AND ${mysql.escape(endDate + " 23:59:59")}`;
      } else if (startDate || endDate) {
        whereClause =
          whereClause +
          ` AND timestamp BETWEEN ${
            startDate
              ? mysql.escape(startDate + " 00:00:00")
              : mysql.escape(endDate + " 00:00:00")
          } AND ${
            startDate
              ? mysql.escape(startDate + " 23:59:59")
              : mysql.escape(endDate + " 23:59:59")
          }`;
      }

      let SQL =
        "SELECT reference_number, product_id, action_type, amount, timestamp, balance, location, responsable, detail FROM inventory_log" +
        whereClause;
      connection.query(SQL, (error, result, field) => {
        console.log(SQL);
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const result = await queryData();
  if (result.length >= 1) {
    return result;
  } else {
    return false;
  }
};
