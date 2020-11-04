/**
 *   @DESCRIPTION   -   Update the information of specific role
 *   @ROUTE         -   [PUT] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const { updateRoleInformation } = require("../../services");

const updateRole = async (req, res, next) => {
  try {
    const { id, role_name, detail, permission } = req.body;

    const result = await updateRoleInformation(
      id,
      role_name,
      detail,
      permission
    );

    if (result) {
      res.json({
        success: true,
        message: "Update role information successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update role information",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = updateRole;
