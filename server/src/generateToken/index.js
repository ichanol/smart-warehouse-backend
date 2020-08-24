const generateAccessToken = require("./accessTokenGenerator");
const generateRefreshToken = require("./refreshTokenGenerator");
const tokenGenerator = {
  generateAccessToken,
  generateRefreshToken,
};
module.exports = tokenGenerator;
