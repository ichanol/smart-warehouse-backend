const { validateUserLogin } = require("../services");

const userLoginHandler = async (username, password) => {
  const loginResult = await validateUserLogin(username, password);

  if (loginResult.length === 1) {
    console.log(username, "login");
    return true;
  } else {
    return false;
  }
};

module.exports = userLoginHandler;
