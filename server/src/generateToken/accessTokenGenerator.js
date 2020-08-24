const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
  });
};

module.exports = generateAccessToken;
