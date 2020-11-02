const connection = require("../Database_connection/connect");
const getTotalRecords = require("./getTotalRecords");

const getAllProductBalance = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT current_product_balance.balance, 
                        current_product_balance.location, 
                        current_product_balance.updated_at, 
                        product.product_name, 
                        product.product_id, 
                        product.company_name, 
                        product.status
                FROM current_product_balance INNER JOIN product
                ON current_product_balance.product_id = product.id
                WHERE product.status = 1 ${whereClause} ${orderByClause} ${limitClause}`;

    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getCurrentProductBalanceHandler = async (req) => {
  console.log(req.originalUrl);
  console.log(req.query);

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
    const totalRecords = await getTotalRecords(
      "current_product_balance",
      "INNER JOIN product ON current_product_balance.product_id = product.id",
      `WHERE product.status = 1 ${whereClause}`
    );
    const numberOfPages = Math.ceil(totalRecords.numberOfRecords / listPerPage);
    const firstIndex = (currentPage - 1) * listPerPage;
    limitClause = `LIMIT ${firstIndex}, ${listPerPage}`;
    
    const productBalanceResult = await getAllProductBalance(
      whereClause,
      orderByClause,
      limitClause
    );

    const response = {
      success: true,
      result: productBalanceResult,
      totalPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords.numberOfRecords,
    }
  
    if (productBalanceResult.length > 0) {
      return response;
    } else {
      return false;
    }
  } else {
    return false
  }

};
