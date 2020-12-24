/**
 *   @DESCRIPTION   -   Delete / deactive specific user
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */

const { disableUser, saveActivity, getUserId } = require("../../services");

const deleteUser = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { username, detail, status } = req.body.source;

    const result = await disableUser(username, detail, status);

    if (result) {
      res.json({
        success: true,
        message:
          "Deactivate user successfully. This user has no longer available",
      });

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${
        req.decodedUsername
      } update ${username} account. ${username}'s ${
        status ? "active" : "inactive"
      }.`;
      const saveActivityResult = await saveActivity(userId, 8, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = deleteUser;
