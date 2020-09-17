const jwt = require("jsonwebtoken");

//  DESCRIPTION   - Verify the token wheather it's valid, invalid, expired
//                  If token is invalid or expired, jwt.verify() will get an error
//                  server response with status code 403 "Unauthorized. Your token is invalid"
//                  If token is valid. Process of this middleware is done
const verifyTokenHandler = (req, res, next) => {
  jwt.verify(req.secretToken, process.env.ACCESS_TOKEN, (err, value) => {
    if (err)
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized. Your token is invalid or expired please try again",
      });
    req.decodedUsername = value.payload;
    next();
  });
};

module.exports = verifyTokenHandler;
