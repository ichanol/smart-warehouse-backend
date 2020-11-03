/**
 *   @DESCRIPTION   -   Delete / deactive specific role
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const { disableRole } = require("../../services");

const deleteRole = async (req, res, next) => {
  try {
    const { role_name, status } = req.body.source;

    const result = await disableRole(role_name, status);

    if (result) {
      res.json({
        success: true,
        message: "Remove role successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to remove role",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = deleteRole;
