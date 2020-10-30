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

/**
 *   @DESCRIPTION   -   Generate new access token and refresh token
 *   @ROUTE         -   [GET] /api/smart-warehouse/renewtoken
 *   @ACCESS        -   PUBLIC
 */

exports.reNewToken = (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "New token",
      username: req.decodedUsername,
      newAccessToken: generateAccessToken(req.decodedUsername),
      newRefreshToken: generateRefreshToken(req.decodedUsername),
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const { number } = req.params;
  const username = "tip";

  const serialNumberGenerator = (length) => {
    var result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const productNameGenerator = () => {
    const arr = [
      "glass",
      "pen",
      "calendar",
      "charger",
      "USB-C",
      "shirt",
      "paint",
    ];
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const companyNameGenerator = () => {
    const arr = ["Magic Box Asia", "Loong Pol"];
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const locationGenerator = () => {
    const arr = ["Setthiwan 5th flr.", "Setthiwan 4th flr."];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const insertData = () => {
    return new Promise((resolve, reject) => {
      let mockData = "";

      for (let i = 1; i <= number; i++) {
        if (i == number) {
          mockData += `(
        ${mysql.escape(serialNumberGenerator(10))},
        ${mysql.escape(productNameGenerator())},
        ${mysql.escape(companyNameGenerator())},
        ${mysql.escape(locationGenerator())},
        ${mysql.escape("detail ...")},
        ${mysql.escape(1)},
        (SELECT id FROM user WHERE username = ${mysql.escape(username)})
        )`;
        } else {
          mockData += `(
          ${mysql.escape(serialNumberGenerator(10))},
          ${mysql.escape(productNameGenerator())},
          ${mysql.escape(companyNameGenerator())},
          ${mysql.escape(locationGenerator())},
          ${mysql.escape("detail ...")},
          ${mysql.escape(1)},
          (SELECT id FROM user WHERE username = ${mysql.escape(username)})
        ),`;
        }
      }
      const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status, created_by) VALUES ${mockData}`;
      connection.query(SQL, (error, result, field) => {
        console.log(SQL);
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const result = await insertData();
  if (result) {
    res.json({ success: true, message: `${number} has been created` });
  } else {
    res.json({ success: false, message: "Failed to create new product" });
  }
};

exports.uploadFiles = (req, res, next) => {
  const fs = require("fs");
  const readXlsxFile = require("read-excel-file/node");
  global.__basedir = "/app";
  console.log(req.file);
  console.log(req.body.name);

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chanatip.ras@mail.kmutt.ac.th', // your email
      pass: 'Chanatip733.' // your email password
    }
  });

  let mailOptions = {
    from: 'chanatip.ras@mail.kmutt.ac.th',                // sender
    to: 'chanatip.ras@mail.kmutt.ac.th',                // list of receivers
    subject: 'Hello from node express server',              // Mail subject
    html: '<b>Do you receive this mail?</b><br/><a>55555555<a/>'   // HTML body
  };

  //------------------------------------------------
  // -> Import Excel Data to MySQL database
  function importExcelData2MySQL(filePath) {
    readXlsxFile(filePath).then((rows) => {

      // Remove Header ROW
      rows.shift();
      console.log(rows);
      const SQL =
        "INSERT INTO product (product_id, product_name, company_name,location,detail, status, created_by) VALUES ?";
      connection.query(SQL, [rows], (error, result, field) => {
        if (error) {
          console.log(error);
          res.json({ success: false, message: error });
        } else {
          res.json({ success: true, message: result });
          console.log(result);

          transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
        }
      });
    });
  }
  //------------------------------------------------

  importExcelData2MySQL(req.file.path);
};
