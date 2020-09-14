const mysql = require("mysql");
const connection = require("../Database_connection/connect");

const getAll = require("../models/getAll");
const update = require("../models/update");

/**
 *   @DESCRIPTION   -   Destroy user credential
 *   @ROUTE         -   [POST] /api/smart-warehouse/logout
 *   @ACCESS        -   PRIVATE
 */
exports.userLogOut = (req, res, next) => {
  try {
    res.json({ success: true, message: "Log out" });
    connection.end();
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Add import or export products transaction (S/N, amount, etc), update the tables in the database
 *   @ROUTE         -   [POST] /api/smart-warehouse/import-export-product
 *   @ACCESS        -   PRIVATE (admin, crew)
 */
exports.updateTransaction = async (req, res, next) => {
  try {
    const createTransaction = require("../models/createTransaction");
    const { referenceNumber, actionType, username, productList } = req.body;

    const isSuccess = await createTransaction(
      mysql,
      connection,
      referenceNumber,
      actionType,
      username,
      productList
    );
    if (isSuccess) {
      res.json({ success: true, message: "Save transaction successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Save product list failed" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   When client send this request to server, server will send another request
 *                      to the hardware to tell the RFID reader to read RFID tags
 *   @ROUTE         -   [GET] /api/smart-warehouse/read-RFID
 *   @ACCESS        -   PRIVATE (admin,crew)
 */
exports.readRFID = (req, res, next) => {
  try {
    res.json({ success: true, message: "READ RFID" });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Show the transaction/history (import/export logs), user can filter the result
//                  by sending query parameters with request
//  ROUTE         - [GET] /api/smart-warehouse/product-transaction
//  ACCESS        - PRIVATE (admin reporter)
exports.productTransaction = (req, res, next) => {
  try {
    res.json({ success: true, message: "HISTORY" });
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Show the current amount of each product that store in the warehouse
 *   @ROUTE         -   [GET] /api/smart-warehouse/product-balance
 *   @ACCESS        -   PRIVATE (admin, reporter)
 */
exports.productBalance = async (req, res, next) => {
  try {
    const result = await getAll("current_product_balance", connection);
    if (result) {
      res.json({ success: true, result });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }
  } catch (error) {
    next(error);
  }
};

/****************************************************************** @ADMIN_ONLY ******************************************************************/
/**
 *   @DESCRIPTION   -   Get the list of all registered user
 *   @ROUTE         -   [GET] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.getUser = async (req, res, next) => {
  try {
    const result = await getAll("user");
    if (result) {
      res.json({ success: true, result });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Get the list of all registered product
 *   @ROUTE         -   [GET] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.getProduct = async (req, res, next) => {
  try {
    const result = await getAll("product");
    if (result) {
      res.json({ success: true, result });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Get the list of all roles
 *   @ROUTE         -   [GET] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.getRole = async (req, res, next) => {
  try {
    const result = await getAll("role");
    if (result) {
      res.json({ success: true, result });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }
  } catch (error) {
    next(error);
  }
};

/*************************************************************************************************************************************************** */

/**
 *   @DESCRIPTION   -   Update the information of specific user
 *   @ROUTE         -   [PUT] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.updateUser = async (req, res, next) => {
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

    const SQL = `UPDATE user SET 
                  username= ${mysql.escape(username)}, 
                  firstname = ${mysql.escape(firstname)},
                  lastname = ${mysql.escape(lastname)},
                  password = ${mysql.escape(password)},
                  role = ${mysql.escape(role)},
                  status = ${mysql.escape(status)} 
                  WHERE id = ${mysql.escape(id)};`;

    const result = await update(SQL);
    if (result) {
      res.json({
        success: true,
        message: "Update user information successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update user information",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Update the information of specific product
 *   @ROUTE         -   [PUT] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const {
      id,
      product_id,
      product_name,
      company_name,
      location,
      detail,
    } = req.body;

    const SQL = `UPDATE product SET 
                  product_id = ${mysql.escape(product_id)},
                  product_name = ${mysql.escape(product_name)},
                  company_name = ${mysql.escape(company_name)},
                  location = ${mysql.escape(location)},
                  detail = ${mysql.escape(detail)}
                  WHERE id = ${mysql.escape(id)};`;

    const result = await update(SQL);
    if (result) {
      res.json({
        success: true,
        message: "Update product information successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update product information",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Update the information of specific role
 *   @ROUTE         -   [PUT] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.updateRole = async (req, res, next) => {
  try {
    const { id, role_name, detail } = req.body;
    const SQL = `UPDATE role SET 
                  role_name = ${mysql.escape(role_name)},
                  detail = ${mysql.escape(detail)}
                  WHERE id = ${mysql.escape(id)};`;

    const result = await update(SQL);
    if (result) {
      res.json({
        success: true,
        message: "Update role information successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update role information",
      });
    }
  } catch (error) {
    next(error);
  }
};

/*************************************************************************************************************************************************** */

/**
 *   @DESCRIPTION   -   Delete / deactive specific user
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { username, detail } = req.body;
    const SQL = `UPDATE user SET 
                  status = 2,
                  detail = ${mysql.escape(detail)}
                  WHERE username = ${mysql.escape(username)};`;

    const result = await update(SQL);
    if (result) {
      res.json({
        success: true,
        message:
          "Deactivate user successfully. This user has no longer available",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Delete / remove specific product
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { product_id, detail } = req.body;
    console.log(product_id, detail);
    const SQL = `UPDATE product SET 
                  status = 2,
                  detail = ${mysql.escape(detail)}
                  WHERE product_id = ${mysql.escape(product_id)};`;

    const result = await update(SQL);
    if (result) {
      res.json({
        success: true,
        message: "Remove product successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to remove product",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Delete / deactive specific role
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.deleteRole = async (req, res, next) => {
  try {
    res.json("DELETE ROLE");
  } catch (error) {
    next(error);
  }
};

/*************************************************************************************************************************************************** */

/**
 *   @DESCRIPTION   -   Create new user
 *   @ROUTE         -   [POST] /api/smart-warehouse/users
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.createUser = async (req, res, next) => {
  try {
    const { username, firstname, lastname, password, role, status } = req.body;
    const SQL = `INSERT INTO user(username, firstname, lastname, password, role, status) VALUES(
                  ${mysql.escape(username)},
                  ${mysql.escape(firstname)},
                  ${mysql.escape(lastname)},
                  ${mysql.escape(password)},
                  ${mysql.escape(role)},
                  ${mysql.escape(status)}
                  )`;

    const result = await update(SQL);
    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new user account",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new user account",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Create new product
 *   @ROUTE         -   [POST] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
    } = req.body;
    const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status) VALUES (
                  ${mysql.escape(product_id)},
                  ${mysql.escape(product_name)},
                  ${mysql.escape(company_name)},
                  ${mysql.escape(location)},
                  ${mysql.escape(detail)},
                  ${mysql.escape(status)}
                  )`;

    const result = await update(SQL);
    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new product",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new product",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *   @DESCRIPTION   -   Create new role
 *   @ROUTE         -   [POST] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.createRole = async (req, res, next) => {
  try {
    const { role_name, detail } = req.body;
    const SQL = `INSERT INTO role(role_name, detail) VALUES (
                  ${mysql.escape(role_name)},
                  ${mysql.escape(detail)}
                  )`;

    const result = await update(SQL);
    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new role",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new role",
      });
    }
  } catch (error) {
    next(error);
  }
};
