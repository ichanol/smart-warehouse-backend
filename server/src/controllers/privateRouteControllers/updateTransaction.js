/**
 *   @DESCRIPTION   -   Add import or export products transaction (S/N, amount, etc), update the tables in the database
 *   @ROUTE         -   [POST] /api/smart-warehouse/import-export-product
 *   @ACCESS        -   PRIVATE (admin, crew)
 */

const updateTransactionHandler = require("../../models/updateTransactionHandler");
const { saveActivity, getUserId } = require("../../services");

const updateTransaction = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const {
      referenceNumber,
      actionType,
      username,
      productList,
      transactionRemark,
      sourceTransaction,
    } = req.body;

    const isSuccess = await updateTransactionHandler(
      referenceNumber,
      actionType,
      username,
      productList,
      transactionRemark,
      sourceTransaction
    );
    if (isSuccess) {
      res.json({ success: true, message: "Save transaction successfully" });

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} update transaction. ${
        productList
          ? referenceNumber +
            " was created. Refer to " +
            sourceTransaction.reference_number
          : sourceTransaction.reference_number + " was cancel(inactive)"
      }.`;
      const saveActivityResult = await saveActivity(userId, 11, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Save product list failed" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = updateTransaction;
