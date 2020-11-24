/**
 *   @DESCRIPTION   -   Validate user account
 *   @ROUTE         -   [POST] /api/smart-warehouse/login
 *   @ACCESS        -   PUBLIC
 */

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../generateToken");
const userLoginHandler = require("../../models/userLoginHandler")

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const isSuccess = await userLoginHandler(mysql, connection, username, password);
    if (isSuccess) {
      res.json({
        success: true,
        message: "Log in",
        accessToken: generateAccessToken(username),
        refreshToken: generateRefreshToken(username),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Incorrect username or password",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userLogin;
