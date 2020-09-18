module.exports = getProductInformation = async (mysql, connection, data) => {
  const queryData = () => {
    return new Promise((resolve, reject) => {
      let temp;
      data.map((value, key) => {
        if (key === 0) {
          temp = `${mysql.escape(value.product_serial_number)}`;
        } else if (key === data.length - 1) {
          temp = temp + `,${mysql.escape(value.product_serial_number)}`;
        } else {
          temp = temp + `,${mysql.escape(value.product_serial_number)}`;
        }
      });

      const SQL = `SELECT id, product_name, company_name, location, detail FROM product WHERE status = 1 AND product_id IN (${temp})`;

      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const currentProductBalanceResult = await queryData();

  if (currentProductBalanceResult.length >= 1) {
    currentProductBalanceResult.map((value, key) => {
      currentProductBalanceResult[key].product_serial_number =
        data[key].product_serial_number;
      currentProductBalanceResult[key].amount = data[key].amount;
    });
    return currentProductBalanceResult;
  } else {
    return false;
  }
};
// Balance=>Inventory||stock

// + , - log amount
// more than