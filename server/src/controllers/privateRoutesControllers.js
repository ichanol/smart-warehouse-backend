const mysql = require("mysql");
const connection = require("../Database_connection/connect");
const moment = require("moment");

const getAll = require("../models/getAll");
const update = require("../models/update");
const getBalance = require("../models/getBalance");

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

/**
 *   @DESCRIPTION   -   Show the transaction/history (import/export logs), user can filter the result
 *                      by sending query parameters with request
 *   @ROUTE         -   [GET] /api/smart-warehouse/product-transaction
 *   @ACCESS        -   PRIVATE (admin reporter)
 */
exports.productTransaction = async (req, res, next) => {
  try {
    const today = moment();
    const searchTransactionLog = require("../models/searchTransactionLog");
    const start = req.query.startdate || "2020-01-01"; // Need to refactor default startDate
    const end = req.query.enddate || today;
    const columnName = req.query.column || "timestamp";
    const sortDirection = req.query.sort || "DESC";
    const keyword = req.query.keyword || null;
    const amstart = req.query.start || 1;
    const amend = req.query.end || 999999;

    const filterArr = [
      { str: "product_id", value: req.query.productid || null },
      { str: "responsable", value: req.query.responsable || null },
      { str: "reference_number", value: req.query.ref || null },
      { str: "action.action_type", value: req.query.action || null },
      { str: "amount", value: req.query.amount || null },
      { str: "balance", value: req.query.balance || null },
    ];

    const startDate = moment(start).format("yyyy-MM-DD");
    const endDate = moment(end).format("yyyy-MM-DD");

    const result = await searchTransactionLog(
      mysql,
      connection,
      filterArr,
      startDate,
      endDate,
      columnName,
      sortDirection,
      keyword,
      amstart,
      amend
    );
    if (result) {
      res.json({ success: true, result });
    } else {
      res.json({ success: false, message: "No information" });
    }
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
    const getCurrentProductBalanceHandler = require("../models/getCurrentProductBalanceHandler");
    const {
      success,
      result,
      totalPages,
      currentPage,
      totalRecords,
    } = await getCurrentProductBalanceHandler(req);

    if (success) {
      res.json({
        success: true,
        result,
        totalPages,
        currentPage,
        totalRecords,
      });
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
    const sortDirection = req.query.sort || "ASC";
    const columnName = req.query.column || "firstname";
    const keyword = req.query.keyword || null;
    const role = req.query.role || null;

    const result = await getAll(
      "user",
      sortDirection,
      columnName,
      keyword,
      role,
      mysql
    );
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
exports.getProduct = (req, res, next) => {
  res.json(req.preparedResponse);
};

/**
 *   @DESCRIPTION   -   Get the list of all roles
 *   @ROUTE         -   [GET] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */
exports.getRole = async (req, res, next) => {
  res.json(req.preparedResponse);
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
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
    } = req.body;

    const SQL = `UPDATE product SET 
                  product_id = ${mysql.escape(product_id)},
                  product_name = ${mysql.escape(product_name)},
                  company_name = ${mysql.escape(company_name)},
                  location = ${mysql.escape(location)},
                  detail = ${mysql.escape(detail)},
                  status = (SELECT id FROM product_status WHERE status_value = ${status})
                  WHERE product_id = ${mysql.escape(product_id)};`;

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
    let SQL;
    const { id, role_name, detail, status, permission } = req.body;
    console.log("----------------------------");
    console.log(id, role_name, detail, status, permission);
    console.log("----------------------------");
    if (id && role_name && permission) {
      SQL = `UPDATE role SET 
                    role_name = ${mysql.escape(role_name)},
                    detail = ${mysql.escape(detail)},
                    permission = ${mysql.escape(JSON.stringify(permission))}
                    WHERE id = ${mysql.escape(id)};`;
    } else {
      SQL = `UPDATE role SET status = (SELECT id FROM role_status WHERE status_value = ${mysql.escape(
        status
      )}) 
      WHERE id = ${mysql.escape(id)};`;
    }

    console.log(mysql.escape(status), SQL);
    const result = await update(SQL);
    if (result) {
      console.group(result);
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
    console.log(username, detail);
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
    const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status, created_by) VALUES (
                  ${mysql.escape(product_id)},
                  ${mysql.escape(product_name)},
                  ${mysql.escape(company_name)},
                  ${mysql.escape(location)},
                  ${mysql.escape(detail)},
                  ${mysql.escape(status)},
                  (SELECT id FROM user WHERE username = ${mysql.escape(
                    req.decodedUsername
                  )})
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
    const { role_name, detail, permission, status } = req.body;
    const SQL = `INSERT INTO role(role_name, detail, permission, status) VALUES (
                  ${mysql.escape(role_name)},
                  ${mysql.escape(detail)},
                  ${mysql.escape(JSON.stringify(permission))},
                  (SELECT id FROM role_status WHERE status_value = ${status})
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
