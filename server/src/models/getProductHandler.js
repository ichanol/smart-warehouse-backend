const { getTotalNumberOfRecords, getProduct } = require("../services");

const getProductHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "ORDER BY product.status ASC, product.created_at ASC";
  let limitClause = "";

  const response = {
    success: false,
    result: null,
    totalPages: null,
    currentPage: null,
    totalRecords: null,
  };

  if (req.query?.column) {
    orderByClause = `ORDER BY product.status ASC, ${req.query.column} ${
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
          whereClause = `WHERE (product.product_id LIKE '%${req.query.search}%' 
                                  OR product.product_name LIKE '%${req.query.search}%' 
                                  OR product.company_name LIKE '%${req.query.search}%' 
                                  OR product.created_at LIKE '%${req.query.search}%' 
                                  OR product.updated_at LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          console.log(value.value);
          if (value.value === "0") {
            whereClause = "WHERE product_status.status_value = 0";
          } else if (value.value === "1") {
            whereClause = "WHERE product_status.status_value = 1";
          }
        } else {
          whereClause = `WHERE ${value.string} = ${mysql.escape(value.value)}`;
        }
      } else {
        if (value.string === "search") {
          whereClause =
            whereClause +
            ` AND (product.product_id LIKE '%${req.query.search}%' 
                                            OR product.product_name LIKE '%${req.query.search}%' 
                                            OR product.company_name LIKE '%${req.query.search}%' 
                                            OR product.created_at LIKE '%${req.query.search}%' 
                                            OR product.updated_at LIKE '%${req.query.search}%')`;
        } else if (value.string === "status") {
          if (value.value === "0") {
            whereClause = whereClause + " AND product_status.status_value = 0";
          } else if (value.value === "1") {
            whereClause = whereClause + " AND product_status.status_value = 1";
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
    "product",
    "INNER JOIN product_status ON product.status = product_status.id",
    whereClause
  );
  const numberOfPages = Math.ceil(totalRecords / listPerPage);
  const firstIndex = (currentPage - 1) * listPerPage;
  limitClause = `LIMIT ${firstIndex}, ${listPerPage}`;

  const productResult = await getProduct(
    whereClause,
    orderByClause,
    limitClause
  );

  if (productResult.length) {
    response.success = true;
    response.result = productResult;
    response.totalPages = numberOfPages;
    response.currentPage = currentPage;
    response.totalRecords = totalRecords;
  }
  return response;
};

module.exports = getProductHandler;
