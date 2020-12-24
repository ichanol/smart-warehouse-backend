/**
 *   @DESCRIPTION   -   Create new user
 *   @ROUTE         -   [POST] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */

const { createNewUser, saveActivity, getUserId } = require("../../services");

const createUser = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const {
      username,
      firstname,
      lastname,
      email,
      password,
      role,
      status,
    } = req.body;

    const result = await createNewUser(
      username,
      firstname,
      lastname,
      email,
      password,
      role,
      status
    );

    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new user account",
      });

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} create a new user account. ${username}(${firstname} ${lastname})'s account created.`;
      const saveActivityResult = await saveActivity(userId, 5, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
          id: 5,
          username: req.decodedUsername,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new user account",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = createUser;
