const { getTotalNumberOfRecords, getProduct } = require("../services");

module.exports = getProductHandler = async (req) => {
  let whereClause = "";
  let orderByClause = "ORDER BY product.status ASC, product.created_at ASC";
  let limitClause = "";

  if (req.query?.numberPerPage && req.query?.page) {
    if (req.query?.column) {
      orderByClause = `ORDER BY product.status ASC, ${req.query.column} ${
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
            whereClause = `WHERE (product.product_id LIKE '%${req.query.search}%' 
                                  OR product.product_name LIKE '%${req.query.search}%' 
                                  OR product.company_name LIKE '%${req.query.search}%' 
                                  OR product.created_at LIKE '%${req.query.search}%' 
                                  OR product.updated_at LIKE '%${req.query.search}%')`;
          } else if (value.string === "status") {
            if (value.value === 0) {
              whereClause = "WHERE product_status.status_value = 0";
            } else if (value.value === 1) {
              whereClause = "WHERE product_status.status_value = 1";
            }
          } else {
            whereClause = `WHERE ${value.string} = ${mysql.escape(
              value.value
            )}`;
          }
        } else {
          if (value.string === "search") {
            whereClause = ` AND (product.product_id LIKE '%${req.query.search}%' 
                                  OR product.product_name LIKE '%${req.query.search}%' 
                                  OR product.company_name LIKE '%${req.query.search}%' 
                                  OR product.created_at LIKE '%${req.query.search}%' 
                                  OR product.updated_at LIKE '%${req.query.search}%')`;
          } else if (value.string === "status") {
            if (value.value === 0) {
              whereClause = " AND product_status.status_value = 0";
            } else if (value.value === 1) {
              whereClause = " AND product_status.status_value = 1";
            }
          } else {
            whereClause =
              whereClause +
              ` AND ${value.string} = ${mysql.escape(value.value)}`;
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

    const response = {
      success: true,
      result: productResult,
      totalPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords,
    };

    if (productResult.length) {
      return response;
    } else {
      return false;
    }
  } else if (req.query?.validate) {
    const orderByClause = "ORDER BY status ASC, created_at ASC";
    const whereClause = `WHERE product.product_id = '${req.query.validate}'`;
    const data = await getProduct(whereClause, orderByClause);
  } else {
    return false;
  }
};
