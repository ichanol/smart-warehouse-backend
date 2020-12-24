/**
 *   @DESCRIPTION   -   Delete / deactive specific role
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const { disableRole, saveActivity, getUserId } = require("../../services");

const deleteRole = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { role_name, status } = req.body.source;

    const result = await disableRole(role_name, status);

    if (result) {
      res.json({
        success: true,
        message: "Remove role successfully",
      });

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} update role. ${role_name}'s ${status ? "active" : "inactive"}.`;
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
        message: "Failed to remove role",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = deleteRole;
