//desc     Validate access token
const isLoginHandler = (req, res, next) => {
  console.log("Is user logged in checker");
  next();
};

module.exports = isLoginHandler;
