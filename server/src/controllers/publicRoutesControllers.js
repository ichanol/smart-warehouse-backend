const mysql = require("mysql");
const connection = require("../Database_connection/connect");
const { generateAccessToken } = require("../generateToken/index");
const { generateRefreshToken } = require("../generateToken/index");

//  DESCRIPTION   - Validate user account
//  ROUTE         - [POST] /api/smart-warehouse/login
//  ACCESS        - PUBLIC
exports.userLogIn = (req, res, next) => {
  try {
    const { username, password } = req.body;
    const SQL = `SELECT username FROM user WHERE username = ${mysql.escape(
      username
    )} AND password = ${mysql.escape(password)}`;

    connection.query(SQL, (error, result, field) => {
      if (result.length === 1) {
        res.json({
          success: true,
          message: "Log in",
          accessToken: generateAccessToken(username),
          REFRESHER_TOKEN: generateRefreshToken(username),
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Incorrect username or password" });
      }
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - When hardware detect user RFID it will send the username
//                  that get from RFID card to the server. Server will validate
//                  wheather that username is valid or not. If username's valid,
//                  server will send the data to the web application to complete
//                  log in process to web application
//  ROUTE         - [POST] /api/smart-warehouse/detect-user-RFID/:username
//  ACCESS        - PRIVATE (hardware)
exports.detectedUserRFID = (req, res, next) => {
  try {
    const { username } = req.body;
    const SQL = `SELECT username FROM user WHERE username = ${mysql.escape(
      username
    )}`;
    connection.query(SQL, (error, result, field) => {
      if (result.length === 1) {
        // send access success information to client
        res.send("HARDWARE SEND USERNAME/USER_ID FROM RFID CARD" + username);
      } else {
        res.status(404).send("Access denied");
      }
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - When hardware read the RFID tags from product successfully.
//                  It will send request that has a data (S/N, amount, etc) embedded
//                  in the body of the request to the server. Server will forward all
//                  the data and information to web application
//  ROUTE         - [POST] /api/smart-warehouse/datect-product-RFID
//  ACCESS        - PRIVATE (hardware)
exports.detectedProductRFID = (req, res, next) => {
  const { data } = req.body;
  // send prodcut data to client
  res.send("Product data from RFID reader");
};
