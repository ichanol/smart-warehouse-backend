/**
 *   @DESCRIPTION   -   When hardware detect user RFID it will send the username that get from RFID card to the server.
 *                      Server will validate wheather that username is valid or not. If username's valid,
 *                      server will send the data to the web application to complete log in process to web application
 *   @ROUTE         -   [POST] /api/smart-warehouse/detect-user-RFID
 *   @ACCESS        -   PRIVATE (hardware)
 */

const { validateUserIdCard } = require("../../services");
const { saveActivity, getUserId } = require("../../services");

const detectUserId = async (req, res, next) => {
  try {
    const io = require("../../../server");
    const { username } = req.body;
    const loginResult = await validateUserIdCard(username);

    if (loginResult.length === 1) {
      io.in(username).emit("USER_GRANTED", {
        granted: true,
        message: `[access granted]`,
        room: username,
      });
      const userId = await getUserId(username);
      const activityDetail = `${username}'s card Detected`;
      const saveActivityResult = await saveActivity(userId, 3, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
          id: 3,
          username: username,
        });
      }
      res.json({
        success: true,
        message: "HARDWARE SEND USERNAME / USER_ID FROM RFID CARD. " + username,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "RFID card not valid",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = detectUserId;
