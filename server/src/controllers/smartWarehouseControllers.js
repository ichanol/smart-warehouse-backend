const mysql = require("mysql");
const connection = require("../Database_connection/connect");
const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ payload }, process.env.REFRESHER_TOKEN, {
    expiresIn: "60s",
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("HEADER TOKEN:", token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, username) => {
    console.log(err);
    console.log(username);
    if (err) return res.sendStatus(403);
    req.username = username;
    next();
  });
};

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

//  DESCRIPTION   - Destroy user credential
//  ROUTE         - [POST] /api/smart-warehouse/logout
//  ACCESS        - PRIVATE
exports.userLogOut = (req, res, next) => {
  res.send("LOG OUT");
};

//  DESCRIPTION   - Add import products (S/N, amount, etc), update the tables in the database
//  ROUTE         - [POST] /api/smart-warehouse/import-product
//  ACCESS        - PRIVATE (admin. crew)
exports.importProduct = (req, res, next) => {
  res.send("IMPORT PRODUCT");
};

//  DESCRIPTION   - Add export products (S/N, amount, etc), update the tables in the database
//  ROUTE         - [POST] /api/smart-warehouse/export-product
//  ACCESS        - PRIVATE (admin, crew)
exports.exportProduct = (req, res, next) => {
  res.send("EXPORT PRODUCT");
};

//  DESCRIPTION   - When client send this request to server, server will send another request
//                  to the hardware to tell the RFID reader to read RFID tags
//  ROUTE         - [GET] /api/smart-warehouse/read-RFID
//  ACCESS        - PRIVATE (admin,crew)
exports.readRFID = (req, res, next) => {
  res.send("READ RFID");
};

//  DESCRIPTION   - Show the transaction/history (import/export logs), user can filter the result
//                  by sending query parameters with request
//  ROUTE         - [GET] /api/smart-warehouse/product-transaction
//  ACCESS        - PRIVATE (admin reporter)
exports.productTransaction = (req, res, next) => {
  res.send("HISTORY");
};

//  DESCRIPTION   - Show the current amount of each product that store in the warehouse
//  ROUTE         - [GET] /api/smart-warehouse/product-balance
//  ACCESS        - PRIVATE (admin, reporter)
exports.productBalance = (req, res, next) => {
  res.send("PRODUCT BALANCE");
};

//########################################################################################################################

//  DESCRIPTION   - Get the list of all registered user
//  ROUTE         - [GET] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.getUser = (req, res, next) => {
  try {
    const SQL = `SELECT * FROM user`;
    connection.query(SQL, (error, result, field) => {
      if (result.length > 0) {
        res.json(result);
      } else
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Update the information of specific user
//  ROUTE         - [PUT] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.updateUser = (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      role,
      status,
      password,
      id,
    } = req.body;
    const SQL = `UPDATE user
    SET username= ${mysql.escape(username)}, firstname = ${mysql.escape(
      firstname
    )}, lastname = ${mysql.escape(lastname)},password = ${mysql.escape(
      password
    )},role = ${mysql.escape(role)}, status = ${mysql.escape(status)}
    WHERE id = ${mysql.escape(id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Update user information successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Delete / deactive specific user
//  ROUTE         - [DELETE] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.deleteUser = (req, res, next) => {
  try {
    const { username, detail } = req.body;
    const SQL = `UPDATE user SET status = 2, detail = ${mysql.escape(
      detail
    )} WHERE username = ${mysql.escape(username)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message:
          "Deactivate user successfully. This user has no longer available",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Create new user
//  ROUTE         - [POST] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.createUser = (req, res, next) => {
  try {
    const { username, firstname, lastname, password, role, status } = req.body;
    const SQL = `INSERT INTO user(username, firstname, lastname, password, role, status) VALUES (${mysql.escape(
      username
    )},${mysql.escape(firstname)},${mysql.escape(lastname)},${mysql.escape(
      password
    )},${mysql.escape(role)}, ${mysql.escape(status)})`;
    connection.query(SQL, (error, result, field) => {
      res.status(201).json({
        success: true,
        message: "Successfully created a new user account",
      });
    });
  } catch (error) {
    next(error);
  }
};

//########################################################################################################################

//  DESCRIPTION   - Get the list of all registered product
//  ROUTE         - [GET] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.getProduct = (req, res, next) => {
  try {
    const SQL = `SELECT * FROM product`;
    connection.query(SQL, (error, result, field) => {
      if (result.length > 0) {
        res.json(result);
      } else
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Update the information of specific product
//  ROUTE         - [PUT] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.updateProduct = (req, res, next) => {
  try {
    const {
      id,
      product_id,
      product_name,
      company_name,
      location,
      detail,
    } = req.body;
    const SQL = `UPDATE product
    SET product_id = ${mysql.escape(product_id)}, product_name = ${mysql.escape(
      product_name
    )}, company_name = ${mysql.escape(company_name)}, location = ${mysql.escape(
      location
    )}, detail = ${mysql.escape(detail)}
    WHERE id = ${mysql.escape(id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Update product information successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Delete / remove specific product
//  ROUTE         - [DELETE] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.deleteProduct = (req, res, next) => {
  try {
    const { product_id, detail } = req.body;
    console.log(product_id, detail);
    const SQL = `UPDATE product SET status = 2, detail = ${mysql.escape(
      detail
    )} WHERE product_id = ${mysql.escape(product_id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Remove product successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Create new product
//  ROUTE         - [POST] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.createProduct = (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
    } = req.body;
    const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status) VALUES (${mysql.escape(
      product_id
    )},${mysql.escape(product_name)},${mysql.escape(
      company_name
    )},${mysql.escape(location)},${mysql.escape(detail)},${mysql.escape(
      status
    )})`;
    connection.query(SQL, (error, result, field) => {
      res.status(201).json({
        success: true,
        message: "Successfully created a new product",
      });
    });
  } catch (error) {
    next(error);
  }
};

//########################################################################################################################

//  DESCRIPTION   - Get the list of all roles
//  ROUTE         - [GET] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.getRole = (req, res, next) => {
  try {
    const SQL = `SELECT * FROM role`;
    connection.query(SQL, (error, result, field) => {
      if (result.length > 0) {
        res.json(result);
      } else
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Update the information of specific role
//  ROUTE         - [PUT] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.updateRole = (req, res, next) => {
  try {
    const { id, role_name, detail } = req.body;
    const SQL = `UPDATE role
    SET role_name = ${mysql.escape(role_name)}, detail = ${mysql.escape(detail)}
    WHERE id = ${mysql.escape(id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Update role information successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Delete / deactive specific role
//  ROUTE         - [DELETE] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.deleteRole = (req, res, next) => {
  res.send("DELETE ROLE");
};

//  DESCRIPTION   - Create new role
//  ROUTE         - [POST] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.createRole = (req, res, next) => {
  try {
    const { role_name, detail } = req.body;
    const SQL = `INSERT INTO role(role_name, detail) VALUES (${mysql.escape(
      role_name
    )},${mysql.escape(detail)})`;
    connection.query(SQL, (error, result, field) => {
      res.status(201).json({
        success: true,
        message: "Successfully created a new role",
      });
    });
  } catch (error) {
    next(error);
  }
};

//########################################################################################################################

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
