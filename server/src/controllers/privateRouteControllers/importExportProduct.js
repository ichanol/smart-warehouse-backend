/**
 *   @DESCRIPTION   -   Add import or export products transaction (S/N, amount, etc), update the tables in the database
 *   @ROUTE         -   [POST] /api/smart-warehouse/import-export-product
 *   @ACCESS        -   PRIVATE (admin, crew)
 */

const importExportProductHandler = require("../../models/importExportProductHandler");

const importExportProduct = async (req, res, next) => {
  try {
    const {
      referenceNumber,
      actionType,
      username,
      productList,
      transactionRemark,
      warehouse,
    } = req.body;

    const isSuccess = await importExportProductHandler(
      referenceNumber,
      actionType,
      username,
      productList,
      transactionRemark,
      warehouse
    );
    if (isSuccess) {
      res.json({ success: true, message: "Save transaction successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Save product list failed" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = importExportProduct;
