const { getCurrentProductBalance, getTotalNumberOfRecords } = require("../services");

module.exports = getCurrentProductBalanceHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "";
  let limitClause = "";

  if (req.query?.page && req.query?.numberPerPage) {
    if (req.query?.column) {
      orderByClause = `ORDER BY ${req.query.column} ${
        req.query.desc === "true" ? "DESC" : "ASC"
      }`;
    }
    if (req.query?.search) {
      whereClause = `AND (
        product.product_name LIKE '%${req.query.search}%'
        OR product.product_id LIKE '%${req.query.search}%'
        OR product.company_name LIKE '%${req.query.search}%'
        )`;
    }

    const listPerPage = parseInt(req.query.numberPerPage);
    const currentPage = parseInt(req.query.page);
    const totalRecords = await getTotalNumberOfRecords(
      "current_product_balance",
      "INNER JOIN product ON current_product_balance.product_id = product.id",
      `WHERE product.status = 1 ${whereClause}`
    );
    const numberOfPages = Math.ceil(totalRecords / listPerPage);
    const firstIndex = (currentPage - 1) * listPerPage;
    limitClause = `LIMIT ${firstIndex}, ${listPerPage}`;

    const productBalanceResult = await getCurrentProductBalance(
      whereClause,
      orderByClause,
      limitClause
    );

    const response = {
      success: true,
      result: productBalanceResult,
      totalPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords,
    };

    if (productBalanceResult.length) {
      return response;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
