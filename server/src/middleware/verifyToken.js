//desc     Validate access token
const verifyToken = (req, res, next) => {
  console.log("DO SOMETHING IN MIDDLEWARE");
  next();
};

module.exports = verifyToken;
