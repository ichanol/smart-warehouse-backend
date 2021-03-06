const { getUser, getTotalNumberOfRecords } = require("../services");
const mysql = require("mysql");

const getUserHandler = async (req) => {
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

  if (req.query?.column) {
    orderByClause = `ORDER BY user.status ASC, ${req.query.column} ${
      req.query.desc === "true" ? "DESC" : "ASC"
    }`;
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

  const listPerPage = parseInt(req.query.numberPerPage);
  const currentPage = parseInt(req.query.page);
  const totalRecords = await getTotalNumberOfRecords(
    "user",
    "INNER JOIN user_status ON user.status = user_status.id INNER JOIN role ON user.role = role.id",
    "WHERE NOT (user.id = 1)" + whereClause
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

module.exports = getUserHandler;
