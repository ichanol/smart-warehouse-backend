const {
  getTotalNumberOfRecordsForTransaction,
  getTransactionLog,
  getTransactionRecord,
} = require("../services");
const mysql = require("mysql");

const getTransactionHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "ORDER BY inventory_log.reference_number DESC";
  let limitClause = "";

  const response = {
    success: false,
    result: null,
    totalPages: null,
    currentPage: null,
    totalRecords: null,
  };

  if (req.query?.column) {
    orderByClause = `, ${req.query.column} ${
      req.query.desc === "true" ? "DESC" : "ASC"
    }`;
  }

  const filterArray = [
    { string: "search", value: req.query.search || null },

    { string: "amount", value: req.query.amount || null },
    { string: "balance", value: req.query.balance || null },

    { string: "status", value: req.query.status || null },
    {
      string: "import_export_action.action_name",
      value: req.query.action || null,
    },
  ];

  const filter = filterArray.filter((value) => value.value !== null);

  if (filter.length) {
    filter.map((value, key) => {
      if (key === 0) {
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
        } else if (value.string === "amount" || value.string === "balance") {
          const [firstPart, secondPart] = value.value.split(",");
          whereClause = `WHERE ${value.string} BETWEEN ${firstPart} AND ${secondPart}`;
        } else {
          whereClause = `WHERE ${value.string} = ${mysql.escape(value.value)}`;
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
        } else if (value.string === "amount" || value.string === "balance") {
          const [firstPart, secondPart] = value.value.split(",");
          whereClause =
            whereClause +
            ` AND ${value.string} BETWEEN ${firstPart} AND ${secondPart}`;
        } else {
          whereClause =
            whereClause + ` AND ${value.string} = ${mysql.escape(value.value)}`;
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
        whereClause +
          ` AND inventory_log.reference_number = ${value.reference_number}`,
        orderByClause
      )
  );

  const allRelatedProductTransactionResult = await Promise.all(
    allRelatedProductTransaction
  );

  const transactionResult = transactionRecordListResult.map((value, index) => {
    value.data = allRelatedProductTransactionResult[index];
    value.action_name = value.data[0].action_name;
    value.username = value.data[0].username;
    value.detail = value.data[0].detail;
    value.status_value = value.data[0].status_value;
    value.created_at = value.data[0].created_at;
    value.action_type = value.data[0].action_type;
    value.data = allRelatedProductTransactionResult[index].map(
      (value, index) => {
        delete value.action_name;
        delete value.username;
        delete value.detail;
        delete value.status_value;
        delete value.created_at;
        delete value.reference_number;
        delete value.action_type;
        return value;
      }
    );
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
