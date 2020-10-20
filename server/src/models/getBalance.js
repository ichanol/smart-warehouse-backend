const connection = require("../Database_connection/connect");

module.exports = getBalance = async (TABLE, conn, keyword) => {

  const search = (result) => {
    return searchResult = result.filter(row =>
      row.product_id.toLowerCase().indexOf(keyword) > -1 ||
      row.product_name.toLowerCase().indexOf(keyword) > -1
    )
  }

  const queryData = () => {
    return new Promise((resolve, reject) => {
      const SQL = ` SELECT product.id, 
                           product.product_id,  
                           product.product_name, 
                           product.detail, 
                           current_product_balance.balance,
                           inventory_log.timestamp,
                           inventory_log.amount
                    FROM product
                    INNER JOIN current_product_balance ON product.id = current_product_balance.id
                    LEFT JOIN inventory_log ON product.id = inventory_log.id
                    WHERE inventory_log.timestamp IS NOT NULL
                    Order By timestamp DESC
                    `
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
