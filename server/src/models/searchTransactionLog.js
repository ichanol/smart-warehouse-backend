module.exports = searchTransactionLog = async (
  mysql,
  connection,
  filterArr,
  startDate,
  endDate,
  columnName,
  sortDirection,
  keyword,
  amstart,
  amend,
) => {
  const search = (result) => {
    return searchResult = result.filter(row =>
      row.product_id.toLowerCase().indexOf(keyword) > -1 ||
      row.product_name.toLowerCase().indexOf(keyword) > -1 ||
      row.firstname.toLowerCase().indexOf(keyword) > -1
    )
  }
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
        whereClause = `${whereClause ? whereClause + " AND" : " WHERE"
          } timestamp BETWEEN ${mysql.escape(
            startDate + " 00:00:00"
          )} AND ${mysql.escape(endDate + " 23:59:59")}`;
      } else if (startDate || endDate) {
        whereClause =
          whereClause +
          ` AND timestamp BETWEEN ${startDate
            ? mysql.escape(startDate + " 00:00:00")
            : mysql.escape(endDate + " 00:00:00")
          } AND ${startDate
            ? mysql.escape(startDate + " 23:59:59")
            : mysql.escape(endDate + " 23:59:59")
          }`;
      }

      let SQL = `SELECT inventory_log.reference_number, 
                        inventory_log.id, 
                        inventory_log.amount, 
                        inventory_log.timestamp, 
                        inventory_log.balance, 
                        inventory_log.location, 
                        inventory_log.responsable, 
                        inventory_log.detail, 
                        product.product_id, 
                        product.product_name, 
                        product.detail,
                        current_product_balance.balance,
                        user.firstname,
                        action.action_type
                  FROM inventory_log 
                  INNER JOIN product ON inventory_log.id=product.id 
                  LEFT JOIN current_product_balance ON current_product_balance.id=inventory_log.id
                  LEFT JOIN user ON inventory_log.responsable=user.id
                  LEFT JOIN action ON inventory_log.action_type=action.id
                  ${whereClause} AND amount BETWEEN ${amstart} AND ${amend} Order By ${columnName} ${sortDirection}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const result = await queryData();
  if (result.length >= 1) {
    search(result)
    return keyword !== null ? searchResult : result;
  } else {
    return false;
  }
};