const {
  getTotalNumberOfRecordsForTransaction,
  getTransactionLog,
  getTransactionRecord,
} = require("../services");
const mysql = require("mysql");

const getTransactionHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "ORDER BY created_at DESC";
  let limitClause = "";

  const response = {
    success: false,
    result: null,
    totalPages: null,
    currentPage: null,
    totalRecords: null,
  };

  if (req.query?.column) {
    orderByClause = `ORDER BY ${req.query.column} ${
      req.query.desc === "true" ? "DESC" : "ASC"
    }`;
  }

  const filterArray = [
    { string: "search", value: req.query.search || null },

    {
      string: "inventory_log_product_list.amount",
      value: req.query.amount || null,
    },
    {
      string: "inventory_log_product_list.balance",
      value: req.query.balance || null,
    },

    { string: "status", value: req.query.status || null },
    {
      string: "action",
      value: req.query.action || null,
    },
    {
      string: "inventory_log.created_at",
      value: req.query.date || null,
    },
  ];

  const filter = filterArray.filter((value) => value.value !== null);

  if (filter.length) {
    filter.map((value, index) => {
      if (index === 0) {
        if (value.string === "search") {
          whereClause = `WHERE (product.product_name LIKE '%${req.query.search}%' 
                                OR product.product_id LIKE '%${req.query.search}%' 
                                OR inventory_log_product_list.location LIKE '%${req.query.search}%' 
                                OR user.username LIKE '%${req.query.search}%' 
                                OR inventory_log.reference_number LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === "0") {
            whereClause = "WHERE inventory_log_status.status_value = 0";
          } else if (value.value === "1") {
            whereClause = "WHERE inventory_log_status.status_value = 1";
          }
        } else if (value.string === "action") {
          whereClause = `WHERE import_export_action.action_name IN (${value.value.slice(
            0,
            value.value.length - 1
          )})`;
        } else {
          const [firstPart, secondPart] = value.value.split(",");
          whereClause = `WHERE ${value.string} BETWEEN ${mysql.escape(
            firstPart
          )} AND ${mysql.escape(secondPart)}`;
        }
      } else {
        if (value.string === "search") {
          whereClause =
            whereClause +
            ` AND (product.product_name LIKE '%${req.query.search}%' 
              OR product.product_id LIKE '%${req.query.search}%' 
              OR inventory_log_product_list.location LIKE '%${req.query.search}%' 
              OR user.username LIKE '%${req.query.search}%' 
              OR inventory_log.reference_number LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === "0") {
            whereClause =
              whereClause + " AND inventory_log_status.status_value = 0";
          } else if (value.value === "1") {
            whereClause =
              whereClause + " AND inventory_log_status.status_value = 1";
          }
        } else if (value.string === "action") {
          whereClause =
            whereClause +
            ` AND import_export_action.action_name IN (${value.value.slice(
              0,
              value.value.length - 1
            )})`;
        } else {
          const [firstPart, secondPart] = value.value.split(",");
          whereClause =
            whereClause +
            ` AND ${value.string} BETWEEN ${mysql.escape(
              firstPart
            )} AND ${mysql.escape(secondPart)}`;
        }
      }
    });
  }

  const listPerPage = parseInt(req.query.numberPerPage);
  const currentPage = parseInt(req.query.page);
  const totalRecords = await getTotalNumberOfRecordsForTransaction(whereClause);
  const numberOfPages = Math.ceil(totalRecords / listPerPage);
  const firstIndex = (currentPage - 1) * listPerPage;
  limitClause = `LIMIT ${firstIndex}, ${listPerPage}`;

  const transactionRecordListResult = await getTransactionRecord(
    whereClause,
    orderByClause,
    limitClause
  );

  const allRelatedProductTransaction = transactionRecordListResult.map(
    async (value, index) =>
      await getTransactionLog(
        `WHERE inventory_log.reference_number = ${value.reference_number}`
      )
  );

  const allRelatedProductTransactionResult = await Promise.all(
    allRelatedProductTransaction
  );

  const transactionResult = transactionRecordListResult.map((value, index) => {
    value.data = allRelatedProductTransactionResult[index];
    return value;
  });

  if (transactionResult?.length) {
    response.success = true;
    response.result = transactionResult;
    response.totalPages = numberOfPages;
    response.currentPage = currentPage;
    response.totalRecords = totalRecords;
  }
  return response;
};

module.exports = getTransactionHandler;
