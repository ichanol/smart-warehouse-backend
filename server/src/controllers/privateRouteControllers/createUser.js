/**
 *   @DESCRIPTION   -   Create new user
 *   @ROUTE         -   [POST] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */

const { createNewUser } = require("../../services");

const createUser = async (req, res, next) => {
  try {
    const { username, firstname, lastname, password, role, status } = req.body;

    const result = await createNewUser(
      username,
      firstname,
      lastname,
      password,
      role,
      status
    );

    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new user account",
      });
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
