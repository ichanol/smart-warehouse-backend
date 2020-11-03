const { getTotalNumberOfRecords, getRole } = require("../services");

module.exports = getRoleHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "ORDER BY ROLE.status ASC, ROLE.created_at ASC";
  let limitClause = "";

  const response = {
    success: false,
    result: null,
    totalPages: null,
    currentPage: null,
    totalRecords: null,
  };

  if (req.query?.column) {
    orderByClause = `ORDER BY ROLE.status ASC, ${req.query.column} ${
      req.query.desc === "true" ? "DESC" : "ASC"
    }`;
  }

  const filterArray = [
    { string: "status", value: parseInt(req.query?.status) || null },
    { string: "search", value: req.query?.search || null },
  ];
  const filter = filterArray.filter((value) => value.value !== null);

  if (filter.length) {
    filter.map((value, key) => {
      if (key === 0) {
        if (value.string === "search") {
          whereClause = `WHERE (ROLE.role_name LIKE '%${req.query.search}%' 
                                OR ROLE.created_at LIKE '%${req.query.search}%' 
                                OR ROLE.updated_at LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === 0) {
            whereClause = "WHERE role_status.status_value = 0";
          } else if (value.value === 1) {
            whereClause = "WHERE role_status.status_value = 1";
          }
        } else {
          whereClause = `WHERE ${value.string} = ${mysql.escape(value.value)}`;
        }
      } else {
        if (value.string === "search") {
          whereClause = ` AND (ROLE.role_name LIKE '%${req.query.search}%' 
                                OR ROLE.created_at LIKE '%${req.query.search}%' 
                                OR ROLE.updated_at LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === 0) {
            whereClause = " AND role_status.status_value = 0";
          } else if (value.value === 1) {
            whereClause = " AND role_status.status_value = 1";
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
    "role ROLE",
    "INNER JOIN role_status ON ROLE.status = role_status.id",
    whereClause
  );
  const numberOfPages = Math.ceil(totalRecords / listPerPage);
  const firstIndex = (currentPage - 1) * listPerPage;
  limitClause = `LIMIT ${firstIndex}, ${listPerPage}`;

  const productResult = await getRole(whereClause, orderByClause, limitClause);

  if (productResult.length) {
    response.success = true;
    response.result = productResult;
    response.totalPages = numberOfPages;
    response.currentPage = currentPage;
    response.totalRecords = totalRecords;
  }
  return response;
};
