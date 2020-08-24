//  DESCRIPTION   - Check wheather user is log in (have access) or not?
//                  By verify Authorization header
//                  If request don't have authorization header, server response with
//                      status code 401 "You're not authorized. Please Log in"
//                  If request has authorization header, we will check that Is it has a token embedded?
//                  If it doesn't have a token embedded, server response with
//                      status code 400 "Bad request, Your token is missing or corrupted"
//                  If it has a token embedded then the process in this middleware is done

const isLoginHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      req.secretToken = token;
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "Bad request, Your token is missing or corrupted",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "You're not authorized. Please Log in",
    });
  }
};

module.exports = isLoginHandler;
