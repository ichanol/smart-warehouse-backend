/**
 *   @DESCRIPTION   -   Validate user account
 *   @ROUTE         -   [POST] /api/smart-warehouse/login
 *   @ACCESS        -   PUBLIC
 */

const userLoginHandler = require("../../models/userLoginHandler");

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const loginResult = await userLoginHandler(username, password);
    if (loginResult.success) {
      res.json(loginResult);
    } else {
      res.status(404).json(loginResult);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userLogin;
