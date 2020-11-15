const mysql = require("mysql");

const {
  getImportExportProductActionType,
  getProductBalanceForUpdate,
  getUserId,
  updateCurrentProductBalance,
  createTransactionByArray,
  createTransactionRecord,
  getTransactionId,
} = require("../services");

const importExportProductHandler = async (
  referenceNumber,
  actionID,
  username,
  productList
) => {
  const transactionData = [];
  let idForQueryBalance,
    valueToUpdate = "",
    multiplier = 1;

  const actionType = await getImportExportProductActionType(actionID);
  const userId = await getUserId(username);

  const saveTransactionRecordResult = await createTransactionRecord(
    referenceNumber,
    actionID,
    userId,
    "somedetail",
    1
  );

  const transactionId = await getTransactionId(referenceNumber);

  if (actionType === "DELETE") {
    multiplier = -1;
  }

  for (let index = 0; index < productList.length; index++) {
    if (index === 0) {
      idForQueryBalance = `${mysql.escape(parseInt(productList[index].id))}`;
    } else if (index === productList.length - 1) {
      idForQueryBalance =
        idForQueryBalance + `,${mysql.escape(parseInt(productList[index].id))}`;
    } else {
      idForQueryBalance =
        idForQueryBalance + `,${mysql.escape(parseInt(productList[index].id))}`;
    }
  }

  const productBalanceResult = await getProductBalanceForUpdate(
    idForQueryBalance
  );

  for (let index = 0; index < productList.length; index++) {
    const isNegative =
      parseInt(productBalanceResult[index].balance) +
        parseInt(productList[index].amount * multiplier) <
      0;
    if (isNegative) {
      throw {
        message:
          "Balance can't be negative number, This mean your export amount is much more larger than product's balance amount",
      };
    } else {
      transactionData.push([
        transactionId,
        parseInt(productList[index].id),
        parseInt(productList[index].amount),
        parseInt(productBalanceResult[index].balance) +
          parseInt(productList[index].amount * multiplier),
        productList[index].location,
      ]);
    }

    valueToUpdate =
      valueToUpdate +
      `WHEN product_id = ${mysql.escape(
        parseInt(productList[index].id)
      )} THEN ${mysql.escape(
        parseInt(productBalanceResult[index].balance) +
          parseInt(productList[index].amount * multiplier)
      )} `;
  }

  const saveTransactionResult = await createTransactionByArray(transactionData);

  const updateCurrentProductBalanceResult = await updateCurrentProductBalance(
    valueToUpdate,
    idForQueryBalance
  );

  if (
    saveTransactionResult &&
    updateCurrentProductBalanceResult &&
    saveTransactionRecordResult
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = importExportProductHandler;
