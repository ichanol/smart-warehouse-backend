module.exports = createTransaction = async (
  mysql,
  connection,
  referenceNumber,
  actionID,
  username,
  productList
) => {
  let idForQueryBalance,
    valueToInsert,
    valueToUpdate,
    multiplier = 1;

  const getUserId = () => {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT id FROM user WHERE username = ${mysql.escape(
        username
      )}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const getActionType = () => {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT action_type FROM import_export_action WHERE id = ${mysql.escape(
        actionID
      )}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result[0].action_type);
      });
    });
  };

  const [userId] = await getUserId();
  const actionType = await getActionType();

  await productList.map((value, key) => {
    if (key === 0) {
      idForQueryBalance = `${mysql.escape(parseInt(value.id))}`;
    } else if (key === productList.length - 1) {
      idForQueryBalance =
        idForQueryBalance + `,${mysql.escape(parseInt(value.id))}`;
    } else {
      idForQueryBalance =
        idForQueryBalance + `,${mysql.escape(parseInt(value.id))}`;
    }
  });

  const queryProductBalanceData = () => {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT balance FROM current_product_balance WHERE product_id IN (${idForQueryBalance})`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const productBalanceResult = await queryProductBalanceData();

  if (actionType === "DELETE") {
    multiplier = -1;
  }

  await productList.map((value, key) => {
    const isNegative =
      parseInt(productBalanceResult[key].balance) +
        parseInt(value.amount * multiplier) <
      0;
    if (isNegative)
      throw {
        message:
          "Balance can't be negative number, This mean your export amount is much more larger than product's balance amount",
      };
    if (key === 0) {
      valueToInsert = `(
                          ${mysql.escape(parseInt(referenceNumber))},
                          ${mysql.escape(parseInt(value.id))},
                          ${mysql.escape(parseInt(actionID))},
                          ${mysql.escape(parseInt(value.amount))},
                          ${mysql.escape(
                            parseInt(productBalanceResult[key].balance) +
                              parseInt(value.amount * multiplier)
                          )},
                          ${mysql.escape(value.location)},
                          ${mysql.escape(parseInt(userId.id))},
                          ${mysql.escape(value.detail)}
                        )`;

      valueToUpdate = `WHEN product_id = ${mysql.escape(
        parseInt(value.id)
      )} THEN ${mysql.escape(
        parseInt(productBalanceResult[key].balance) +
          parseInt(value.amount * multiplier)
      )} `;
    } else if (key === productList.length - 1) {
      valueToInsert =
        valueToInsert +
        `,(
          ${mysql.escape(parseInt(referenceNumber))},
          ${mysql.escape(parseInt(value.id))},
          ${mysql.escape(parseInt(actionID))},
          ${mysql.escape(parseInt(value.amount))},
          ${mysql.escape(
            parseInt(productBalanceResult[key].balance) +
              parseInt(value.amount * multiplier)
          )},
          ${mysql.escape(value.location)},
          ${mysql.escape(parseInt(userId.id))},
          ${mysql.escape(value.detail)}
        )`;
      valueToUpdate =
        valueToUpdate +
        `WHEN product_id = ${mysql.escape(
          parseInt(value.id)
        )} THEN ${mysql.escape(
          parseInt(productBalanceResult[key].balance) +
            parseInt(value.amount * multiplier)
        )} `;
    } else {
      valueToInsert =
        valueToInsert +
        `,(
          ${mysql.escape(parseInt(referenceNumber))},
          ${mysql.escape(parseInt(value.id))},
          ${mysql.escape(parseInt(actionID))},
          ${mysql.escape(parseInt(value.amount))},
          ${mysql.escape(
            parseInt(productBalanceResult[key].balance) +
              parseInt(value.amount * multiplier)
          )},
          ${mysql.escape(value.location)},
          ${mysql.escape(parseInt(userId.id))},
          ${mysql.escape(value.detail)}
        )`;
      valueToUpdate =
        valueToUpdate +
        `WHEN product_id = ${mysql.escape(
          parseInt(value.id)
        )} THEN ${mysql.escape(
          parseInt(productBalanceResult[key].balance) +
            parseInt(value.amount * multiplier)
        )} `;
    }
  });

  const updateCurrentProductBalance = () => {
    return new Promise((resolve, reject) => {
      const SQL = `UPDATE current_product_balance SET  balance = CASE ${valueToUpdate} END WHERE product_id IN (${idForQueryBalance})`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const updateCurrentProductBalanceResult = await updateCurrentProductBalance();

  const saveTransaction = () => {
    return new Promise((resolve, reject) => {
      const SQL = `INSERT INTO inventory_log(reference_number, product_id, action_type, amount, balance, location, responsable, detail) VALUES ${valueToInsert}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const saveTransactionResult = await saveTransaction();
  if (saveTransactionResult && updateCurrentProductBalanceResult) {
    return true;
  } else {
    return false;
  }
};
