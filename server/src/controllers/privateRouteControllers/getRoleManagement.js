/**
 *   @DESCRIPTION   -   Get the list of all roles
 *   @ROUTE         -   [GET] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const getRoleHandler = require("../../models/getRoleHandler");
const validateRoleHandler = require("../../models/validateRoleHandler");
const { getRoleName, getPermission } = require("../../services");

const getRoleManagement = async (req, res, next) => {
  try {
    if (req.query?.numberPerPage && req.query?.page) {
      const {
        success,
        result,
        totalPages,
        currentPage,
        totalRecords,
      } = await getRoleHandler(req);

      if (success) {
        res.json({ success, result, totalPages, currentPage, totalRecords });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else if (req.query?.validate) {
      const { success, result } = await validateRoleHandler(req);

      if (success) {
        res.json({ success, result });
      } else {
        res
          .status(204)
          .json({ success: false, message: "Can't get the information" });
      }
    } else if (req.query.get_role) {
      const result = await getRoleName();

      if (result.length) {
        res.json({ success: true, result });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else if (req.query.getPermission) {
      const result = await getPermission();

      if (result.length) {
        res.json({ success: true, result });
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

module.exports = getRoleManagement;
