/**
 *   @DESCRIPTION   -   Get the list of all registered user
 *   @ROUTE         -   [GET] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */

const getUserHandler = require("../../models/getUserHandler");
const validateUserHandler = require("../../models/validateUserHandler");

const getUserManagement = async (req, res, next) => {
  try {
    if (req.query?.numberPerPage && req.query?.page) {
      const {
        success,
        result,
        totalPages,
        currentPage,
        totalRecords,
      } = await getUserHandler(req);
      if (success) {
        res.json({ success, result, totalPages, currentPage, totalRecords });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else if (req.query?.validate) {
      const { success, result } = await validateUserHandler(req);

      if (success) {
        res.json({ success, result });
      } else {
        res
          .status(204)
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

module.exports = getUserManagement;
