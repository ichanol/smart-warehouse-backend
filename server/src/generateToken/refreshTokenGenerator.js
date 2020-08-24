const jwt = require("jsonwebtoken");

const generateRefreshToken = (payload) => {
  return jwt.sign({ payload }, process.env.REFRESHER_TOKEN, {
    expiresIn: process.env.EXPIRED_REFRESH_TOKEN,
  });
};

module.exports = generateRefreshToken;
