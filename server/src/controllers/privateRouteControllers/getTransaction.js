/**
 *   @DESCRIPTION   -   Show the transaction/history (import/export logs), user can filter the result
 *                      by sending query parameters with request
 *   @ROUTE         -   [GET] /api/smart-warehouse/product-transaction
 *   @ACCESS        -   PRIVATE (admin reporter)
 */

const getTransactionHandler = require("../../models/getTransactionHandler");

const getTransaction = async (req, res, next) => {
  try {
    if (req.query?.numberPerPage && req.query?.page) {
      const {
        success,
        result,
        totalPages,
        currentPage,
        totalRecords,
      } = await getTransactionHandler(req);
      if (success) {
        res.json({ success, result, totalPages, currentPage, totalRecords });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }


    //===============================
    //===============================
    //===============================

    // const today = moment();
    // const start = req.query.startdate || "2020-01-01"; // Need to refactor default startDate
    // const end = req.query.enddate || today;
    // const columnName = req.query.column || "timestamp";
    // const sortDirection = req.query.sort || "DESC";
    // const keyword = req.query.keyword || null;
    // const amstart = req.query.start || 1;
    // const amend = req.query.end || 999999;

    // const filterArr = [
    //   { str: "product_id", value: req.query.productid || null },
    //   { str: "responsable", value: req.query.responsable || null },
    //   { str: "reference_number", value: req.query.ref || null },
    //   { str: "action.action_type", value: req.query.action || null },
    //   { str: "amount", value: req.query.amount || null },
    //   { str: "balance", value: req.query.balance || null },
    // ];

    // const startDate = moment(start).format("yyyy-MM-DD");
    // const endDate = moment(end).format("yyyy-MM-DD");

    // const result = await searchTransactionLog(
    //   mysql,
    //   connection,
    //   filterArr,
    //   startDate,
    //   endDate,
    //   columnName,
    //   sortDirection,
    //   keyword,
    //   amstart,
    //   amend
    // );
  } catch (error) {
    next(error);
  }
};

module.exports = getTransaction;
