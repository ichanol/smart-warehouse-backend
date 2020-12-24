/**
 *   @DESCRIPTION   -   Create new role
 *   @ROUTE         -   [POST] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const createRoleHandler = require("../../models/createRoleHandler");
const { saveActivity, getUserId } = require("../../services");

const createRole = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { role_name, detail, permission, status } = req.body;

    const result = await createRoleHandler(
      role_name,
      detail,
      permission,
      status
    );

    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new role",
      });
      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} create a new role. ${role_name} created.`;
      const saveActivityResult = await saveActivity(userId, 7, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
          id: 7,
          username: req.decodedUsername,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new role",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = createRole;
