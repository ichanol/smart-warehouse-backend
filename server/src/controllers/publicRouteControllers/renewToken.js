/**
 *   @DESCRIPTION   -   Generate new access token and refresh token
 *   @ROUTE         -   [GET] /api/smart-warehouse/renewtoken
 *   @ACCESS        -   PUBLIC
 */

const {
  generateRefreshToken,
  generateAccessToken,
} = require("../../generateToken");

const renewToken = (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "New token",
      username: req.decodedUsername,
      newAccessToken: generateAccessToken(req.decodedUsername),
      newRefreshToken: generateRefreshToken(req.decodedUsername),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = renewToken;
