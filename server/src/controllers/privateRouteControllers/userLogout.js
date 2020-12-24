/**
 *   @DESCRIPTION   -   Destroy user credential
 *   @ROUTE         -   [POST] /api/smart-warehouse/logout
 *   @ACCESS        -   PRIVATE
 */

const { saveActivity, getUserId } = require("../../services");

const userLogout = (req, res, next) => {
  try {
    const io = require("../../../server");

    res.json({ success: true, message: "Log out" });
    
    const userId = await getUserId(req.decodedUsername);
    const activityDetail = `${req.decodedUsername} logged out.`;
    const saveActivityResult = await saveActivity(userId, 2, activityDetail);
    if (saveActivityResult) {
      io.emit("ACTIVITY_LOG", {
        message: activityDetail,
        time: Date.now(),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userLogout;
