const connection = require("../Database_connection/connect");
const mysql = require("mysql");

module.exports = getProductInformation = async (data) => {
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

      const SQL = `SELECT 
                        product.id, 
                        product.product_name, 
                        product.company_name, 
                        product.location, 
                        product.detail, 
                        product_status.status_value AS status 
                    FROM product 
                    INNER JOIN product_status ON product.status = product_status.id 
                    WHERE status = 1 AND product.product_id IN (${temp})`;

      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const currentProductBalanceResult = await queryData();

  if (currentProductBalanceResult.length > 0) {
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
