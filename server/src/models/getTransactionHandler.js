const { getTotalNumberOfRecords, getTransactionLog } = require("../services");
const mysql = require("mysql");

const getTransactionHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "ORDER BY user.status ASC, user.created_at ASC";
  let limitClause = "";

  const response = {
    success: false,
    result: null,
    totalPages: null,
    currentPage: null,
    totalRecords: null,
  };

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
  //===================

  //   let whereClause;

  //       const filter = filterArr.filter((value) => value.value !== null);
  //       if (filter.length >= 1) {
  //         filter.map((value, key) => {
  //           if (key === 0) {
  //             whereClause = ` WHERE ${value.str} = ${mysql.escape(value.value)}`;
  //           } else {
  //             whereClause =
  //               whereClause + ` AND ${value.str} = ${mysql.escape(value.value)}`;
  //           }
  //         });
  //       }
  //       if (startDate && endDate) {
  //         whereClause = `${
  //           whereClause ? whereClause + " AND" : " WHERE"
  //         } timestamp BETWEEN ${mysql.escape(
  //           startDate + " 00:00:00"
  //         )} AND ${mysql.escape(endDate + " 23:59:59")}`;
  //       } else if (startDate || endDate) {
  //         whereClause =
  //           whereClause +
  //           ` AND timestamp BETWEEN ${
  //             startDate
  //               ? mysql.escape(startDate + " 00:00:00")
  //               : mysql.escape(endDate + " 00:00:00")
  //           } AND ${
  //             startDate
  //               ? mysql.escape(startDate + " 23:59:59")
  //               : mysql.escape(endDate + " 23:59:59")
  //           }`;
  //       }

  if (req.query?.column) {
    orderByClause = `ORDER BY inventory_log.created_at DESC, ${
      req.query.column
    } ${req.query.desc === "true" ? "DESC" : "ASC"}`;
  }

  const filterArray = [
    { string: "status", value: req.query?.status || null },
    { string: "search", value: req.query?.search || null },
  ];
  const filter = filterArray.filter((value) => value.value !== null);

  if (filter.length) {
    filter.map((value, key) => {
      if (key === 0) {
        if (value.string === "search") {
          whereClause = `AND (user.username LIKE '%${req.query.search}%' 
                                OR user.firstname LIKE '%${req.query.search}%' 
                                OR user.lastname LIKE '%${req.query.search}%' 
                                OR role.role_name LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === "0") {
            whereClause = "AND user_status.status_value = 0";
          } else if (value.value === "1") {
            whereClause = "AND user_status.status_value = 1";
          }
        } else {
          whereClause = `AND ${value.string} = ${mysql.escape(value.value)}`;
        }
      } else {
        if (value.string === "search") {
          whereClause =
            whereClause +
            ` AND (user.username LIKE '%${req.query.search}%' 
                                OR user.firstname LIKE '%${req.query.search}%' 
                                OR user.lastname LIKE '%${req.query.search}%' 
                                OR role.role_name LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === "0") {
            whereClause = whereClause + " AND user_status.status_value = 0";
          } else if (value.value === "1") {
            whereClause = whereClause + " AND user_status.status_value = 1";
          }
        } else {
          whereClause =
            whereClause + ` AND ${value.string} = ${mysql.escape(value.value)}`;
        }
      }
    });
  }

  // INNER JOIN product ON inventory_log.product_id = product.id
  const listPerPage = parseInt(req.query.numberPerPage);
  const currentPage = parseInt(req.query.page);
  const totalRecords = await getTotalNumberOfRecords(
    "inventory_log",
    `INNER JOIN import_export_action ON inventory_log.action_type = import_export_action.id 
     INNER JOIN user ON inventory_log.responsable = user.id
     INNER JOIN inventory_log_status ON inventory_log.status = inventory_log_status.id`
  );
  const numberOfPages = Math.ceil(totalRecords / listPerPage);
  const firstIndex = (currentPage - 1) * listPerPage;
  limitClause = `LIMIT ${firstIndex}, ${listPerPage}`;

  const productResult = await getUser(whereClause, orderByClause, limitClause);

  if (productResult.length) {
    response.success = true;
    response.result = productResult;
    response.totalPages = numberOfPages;
    response.currentPage = currentPage;
    response.totalRecords = totalRecords;
  }
  return response;
};

module.exports = getTransactionHandler;
