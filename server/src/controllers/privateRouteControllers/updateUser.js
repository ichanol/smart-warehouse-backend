/**
 *   @DESCRIPTION   -   Update the information of specific user
 *   @ROUTE         -   [PUT] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */

const { updateUserInformation } = require("../../services");

const updateUser = async (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      email,
      role,
      status,
      password,
      detail,
      id,
    } = req.body;

    const result = await updateUserInformation(
      username,
      firstname,
      lastname,
      email,
      role,
      detail,
      id
    );

    if (result) {
      res.json({
        success: true,
        message: "Update user information successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update user information",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
