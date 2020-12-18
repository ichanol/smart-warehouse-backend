const mysql = require("mysql");

const {
  getProductBalanceForUpdate,
  updateCurrentProductBalance,
  updateTransactionStatus,
} = require("../services");

const importExportProductHandler = require("./importExportProductHandler");

const updateTransactionHandler = async (
  referenceNumber,
  actionID,
  username,
  productList,
  transactionRemark = "",
  sourceTransaction
) => {
  const {
    action_type: oldActionType,
    reference_number: oldReferenceNumber,
    data: oldProductList,
  } = sourceTransaction;
  let idForQueryBalanceToRecalculate = "",
    undoValueToUpdate = "",
    oldMultiplier = 1;

  if (oldActionType === "ADD") {
    multiplier = -1;
  }

  for (let index = 0; index < oldProductList.length; index++) {
    if (index === 0) {
      idForQueryBalanceToRecalculate = `${mysql.escape(
        parseInt(oldProductList[index].id)
      )}`;
    } else if (index === oldProductList.length - 1) {
      idForQueryBalanceToRecalculate =
        idForQueryBalanceToRecalculate +
        `,${mysql.escape(parseInt(oldProductList[index].id))}`;
    } else {
      idForQueryBalanceToRecalculate =
        idForQueryBalanceToRecalculate +
        `,${mysql.escape(parseInt(oldProductList[index].id))}`;
    }
  }

  const productBalanceResultToRecalculate = await getProductBalanceForUpdate(
    idForQueryBalanceToRecalculate
  );

  for (let index = 0; index < oldProductList.length; index++) {
    const isNegative =
      parseInt(productBalanceResultToRecalculate[index].balance) +
        parseInt(oldProductList[index].amount * oldMultiplier) <
      0;
    if (isNegative) {
      throw {
        message:
          "Balance can't be negative number, This mean your export amount is much more larger than product's balance amount",
      };
    }
    undoValueToUpdate =
      undoValueToUpdate +
      `WHEN product_id = ${mysql.escape(
        parseInt(oldProductList[index].id)
      )} THEN ${mysql.escape(
        parseInt(productBalanceResultToRecalculate[index].balance) +
          parseInt(oldProductList[index].amount * oldMultiplier)
      )} `;
  }

  const undoCurrentProductBalanceResult = await updateCurrentProductBalance(
    undoValueToUpdate,
    idForQueryBalanceToRecalculate
  );

  if (undoCurrentProductBalanceResult) {
    const isUpdateSuccess = await updateTransactionStatus(oldReferenceNumber);
    if (isUpdateSuccess) {
      return await importExportProductHandler(
        referenceNumber,
        actionID,
        username,
        productList,
        transactionRemark
      );
    }
  } else {
    return false;
  }
};

module.exports = updateTransactionHandler;
