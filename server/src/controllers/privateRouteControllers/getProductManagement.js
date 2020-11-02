/**
 *   @DESCRIPTION   -   Get the list of all registered product
 *   @ROUTE         -   [GET] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const getProductHandler = require("../../models/getProductHandler");
const validateProductHandler = require("../../models/validateProductHandler");

const getProductManagement = async (req, res, next) => {
  try {
    if (req.query?.numberPerPage && req.query?.page) {
      const {
        success,
        result,
        totalPages,
        currentPage,
        totalRecords,
      } = await getProductHandler(req);

      if (success) {
        res.json({ success, result, totalPages, currentPage, totalRecords });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else if (req.query?.validate) {
      const { success, result } = await validateProductHandler(req);

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

module.exports = getProductManagement;
