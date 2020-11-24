const { validateUserLogin } = require("../services");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../generateToken");

const userLoginHandler = async (username, password) => {
  const response = {
    success: false,
    message: "Username or Password invalid",
  };

  const loginResult = await validateUserLogin(username, password);

  if (loginResult.length) {
    console.log(username, "login");
    response.success = true;
    response.message = "Login successfully";
    response.accessToken = generateAccessToken(username);
    response.refreshToken = generateRefreshToken(username);
    response.permission = loginResult;
  }
  return response;
};

module.exports = userLoginHandler;
