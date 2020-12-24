/**
 *   @DESCRIPTION   -   Validate user account
 *   @ROUTE         -   [POST] /api/smart-warehouse/login
 *   @ACCESS        -   PUBLIC
 */

const userLoginHandler = require("../../models/userLoginHandler");
const { saveActivity, getUserId } = require("../../services");

const userLogin = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { username, password } = req.body;
    const loginResult = await userLoginHandler(username, password);

    if (loginResult.success) {
      res.json(loginResult);

      const userId = await getUserId(username);
      const activityDetail = `${username} has logged in.`;
      const saveActivityResult = await saveActivity(userId, 1, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
          id: 1,
          username: username,
        });
      }
    } else {
      res.status(404).json(loginResult);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userLogin;
