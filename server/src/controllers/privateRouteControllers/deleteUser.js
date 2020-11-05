/**
 *   @DESCRIPTION   -   Delete / deactive specific user
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */

const { disableUser } = require("../../services");

const deleteUser = async (req, res, next) => {
  try {
    const { username, detail, status } = req.body.source;

    const result = await disableUser(username, detail, status);

    if (result) {
      res.json({
        success: true,
        message:
          "Deactivate user successfully. This user has no longer available",
      });
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
