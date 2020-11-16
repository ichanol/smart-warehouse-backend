/**
 *   @DESCRIPTION   -   Show the transaction/history (import/export logs), user can filter the result
 *                      by sending query parameters with request
 *   @ROUTE         -   [GET] /api/smart-warehouse/product-transaction
 *   @ACCESS        -   PRIVATE (admin reporter)
 */

const getTransactionHandler = require("../../models/getTransactionHandler");

const getTransaction = async (req, res, next) => {
  try {
    if (req.query?.numberPerPage && req.query?.page) {
      const {
        success,
        result,
        totalPages,
        currentPage,
        totalRecords,
      } = await getTransactionHandler(req);
      if (success) {
        res.json({ success, result, totalPages, currentPage, totalRecords });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }

  } catch (error) {
    next(error);
  }
};

module.exports = getTransaction;
