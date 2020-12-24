/**
 *   @DESCRIPTION   -   Update the information of specific role
 *   @ROUTE         -   [PUT] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const {
  updateRoleInformation,
  updateRolePermission,
  saveActivity,
  getUserId,
} = require("../../services");

const updateRole = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { id, role_name, detail, permission } = req.body;

    const updateRoleInformationResult = await updateRoleInformation(
      id,
      role_name,
      detail
    );

    const updateRolePermissionResult = await updateRolePermission(
      id,
      permission
    );

    if (updateRoleInformationResult && updateRolePermissionResult) {
      res.json({
        success: true,
        message: "Update role information successfully",
      });

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} update ${role_name}'s information.`;
      const saveActivityResult = await saveActivity(userId, 10, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
        });
      }
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
