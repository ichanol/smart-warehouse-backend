const mysql = require("mysql");

//  Connect to MYSQL (smart-warehouse-database)
const connection = require("../Database_connection/connect");

//  Token
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
        console.log(username, "login");
        res.json({
          success: true,
          message: "Log in",
          accessToken: generateAccessToken(username),
          refreshToken: generateRefreshToken(username),
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
      console.log(SQL);
      if (result.length === 1) {
        // send access success information to client
        console.log("ROOM NAME:", username);

        //  Socket.io from server.js to give access to socket.io
        const io = require("../../server");
        io.in(username).emit("USER_GRANTED", {
          message: `[access granted]`,
          granted: true,
          room: username,
        });
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
  try {
    const { data, username } = req.body;
    const io = require("../../server");

    let temp;

    data.map((value, key) => {
      if (key === 0) {
        temp = `${mysql.escape(value.productSerialNumber)},`;
      } else if (key === data.length - 1) {
        temp = temp + `${mysql.escape(value.productSerialNumber)}`;
      } else {
        temp = temp + `${mysql.escape(value.productSerialNumber)},`;
      }
    });

    const SQL = `SELECT product_name, company_name, location, detail FROM product WHERE status = 1 AND product_id IN (${temp})`;

    connection.query(SQL, (error, result, field) => {
      result.map((value, key) => {
        result[key].productSerialNumber = data[key].productSerialNumber;
        result[key].amount = data[key].amount;
      });
      io.in(username).emit("PRODUCT_SCANNER", {
        success: true,
        productData: result,
      });
      res.send("HARDWARE SEND PRODUCT DATA FROM RFID TAGS");
    });
  } catch (error) {
    next(error);
  }
};
