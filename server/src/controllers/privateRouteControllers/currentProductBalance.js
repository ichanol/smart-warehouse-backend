/**
 *   @DESCRIPTION   -   Show the current amount of each product that store in the warehouse
 *   @ROUTE         -   [GET] /api/smart-warehouse/product-balance
 *   @ACCESS        -   PRIVATE (admin, reporter)
 */

const currentProductBalance = async (req, res, next) => {
  try {
    const getCurrentProductBalanceHandler = require("../../models/getCurrentProductBalanceHandler");
    const {
      success,
      result,
      totalPages,
      currentPage,
      totalRecords,
    } = await getCurrentProductBalanceHandler(req);

    if (success) {
      res.json({
        success: true,
        result,
        totalPages,
        currentPage,
        totalRecords,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = currentProductBalance;
