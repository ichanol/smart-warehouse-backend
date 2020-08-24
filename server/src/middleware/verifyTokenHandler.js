const jwt = require("jsonwebtoken");

const verifyTokenHandler = (req, res, next) => {
  jwt.verify(req.secretToken, process.env.ACCESS_TOKEN, (err, value) => {
    console.log(err);
    console.log(value);
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Your token is not valid" });
    //req.username = username;
    next();
  });
};

module.exports = verifyTokenHandler;
