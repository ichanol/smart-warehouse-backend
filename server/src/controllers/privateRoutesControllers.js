const mysql = require("mysql");
const connection = require("../Database_connection/connect");
const moment = require("moment");

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

/****************************************************************** @ADMIN_ONLY ******************************************************************/

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
