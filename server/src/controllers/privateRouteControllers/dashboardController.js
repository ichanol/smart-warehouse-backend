/**
 *   @DESCRIPTION   -   Get data for dashboard
 *   @ROUTE         -   [GET] /api/smart-warehouse/dashboard
 *   @ACCESS        -   PRIVATE (admin, reporter)
 */

const dashboardHandler = require("../../models/dashboardHandler");

const dashboardController = async (req, res, next) => {
  try {
    const { success, result } = await dashboardHandler(req);
    if (success) {
      res.json({
        success,
        result,
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

module.exports = dashboardController;
