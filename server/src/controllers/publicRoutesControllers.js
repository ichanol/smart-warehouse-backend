const mysql = require("mysql");

const connection = require("../Database_connection/connect");

const login = require("../models/login");
const getProductInformation = require("../models/getProductInformation");
const { generateAccessToken } = require("../generateToken/index");
const { generateRefreshToken } = require("../generateToken/index");

/**
 *   @DESCRIPTION   -   Validate user account
 *   @ROUTE         -   [POST] /api/smart-warehouse/login
 *   @ACCESS        -   PUBLIC
 */
exports.userLogIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const isSuccess = await login(mysql, connection, username, password);
    if (isSuccess) {
      res.json({
        success: true,
        message: "Log in",
        accessToken: generateAccessToken(username),
        refreshToken: generateRefreshToken(username),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Incorrect username or password",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   When hardware detect user RFID it will send the username that get from RFID card to the server.
 *                      Server will validate wheather that username is valid or not. If username's valid,
 *                      server will send the data to the web application to complete log in process to web application
 *   @ROUTE         -   [POST] /api/smart-warehouse/detect-user-RFID
 *   @ACCESS        -   PRIVATE (hardware)
 */
exports.detectedUserRFID = async (req, res, next) => {
  try {
    const io = require("../../server");
    const { username } = req.body;
    const isSuccess = await login(mysql, connection, username);

    if (isSuccess) {
      io.in(username).emit("USER_GRANTED", {
        granted: true,
        message: `[access granted]`,
        room: username,
      });
      res.json({
        success: true,
        message: "HARDWARE SEND USERNAME / USER_ID FROM RFID CARD. " + username,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "RFID card not valid",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   When hardware read the RFID tags from product successfully.
 *                      It will send request that has a data (S/N, amount, etc) embedded
 *                      in the body of the request to the server. Server will forward all
 *                      the data and information to web application
 *   @ROUTE         -   [POST] /api/smart-warehouse/detect-product-RFID/
 *   @ACCESS        -   PRIVATE (hardware)
 */
exports.detectedProductRFID = async (req, res, next) => {
  try {
    const { data, username } = req.body;
    const io = require("../../server");
    const result = await getProductInformation(mysql, connection, data);
    if (result) {
      io.in(username).emit("PRODUCT_SCANNER", {
        success: true,
        productData: result,
      });
      res.json({
        success: true,
        message: "HARDWARE SEND PRODUCT DATA FROM RFID TAGS",
        result,
      });
    } else {
      io.in(username).emit("PRODUCT_SCANNER", {
        success: false,
        productData: null,
        message: "Error",
      });
      res.json({
        success: false,
        message: "Failed to load product information",
      });
    }
  } catch (error) {
    next(error);
  }
};
