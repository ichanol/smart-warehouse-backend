const connection = require("../Database_connection/connect");
const getTotalRecords = require("./getTotalRecords");

const getProductInformation = async (
  firstIndex,
  listPerPage,
  orderByClause,
  whereClause
) => {
  return new Promise((resolve, reject) => {
    let SQL = `SELECT product.product_id, 
                product.product_name, 
                product.company_name, 
                product.location, 
                product.detail, 
                product.created_at, 
                product.updated_at, 
                product_status.status_value AS status,
                user.firstname AS created_by 
                FROM product INNER JOIN product_status ON product.status = product_status.id INNER JOIN user ON product.created_by = user.id  
                ${whereClause} ${orderByClause} ${
      listPerPage ? "LIMIT " + firstIndex + "," + listPerPage : ""
    }`;
    console.log(SQL);
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getProduct = async (req, res, next) => {
  try {
    let response = {
      success: false,
      result: null,
      totalPages: null,
      currentPage: null,
      totalRecords: null,
    };

    if (req.params?.numberPerPage && req.params?.page) {
      let orderByClause = "ORDER BY product.status ASC, product.created_at ASC";
      let whereClause = "";

      if (req.query?.sort) {
        const sort = req.query.sort.split(",");
        orderByClause = `ORDER BY product.status ASC, ${sort[0]} ${
          sort[1] === "true" ? "DESC" : "ASC"
        }`;
      }

      if (req.query?.search && req.query?.status) {
        whereClause = `WHERE (product.product_id LIKE '%${req.query.search}%' 
                        OR product.product_name LIKE '%${req.query.search}%' 
                        OR product.company_name LIKE '%${req.query.search}%' 
                        OR product.created_at LIKE '%${req.query.search}%' 
                        OR product.updated_at LIKE '%${req.query.search}%')`;
        if (req.query.status === "0") {
          whereClause = whereClause + " AND product_status.status_value = 0";
        } else if (req.query.status === "1") {
          whereClause = whereClause + " AND product_status.status_value = 1";
        } else {
          whereClause = whereClause;
        }
      } else if (req.query?.search) {
        whereClause = `WHERE product.product_id LIKE '%${req.query.search}%' 
                        OR product.product_name LIKE '%${req.query.search}%' 
                        OR product.company_name LIKE '%${req.query.search}%' 
                        OR product.created_at LIKE '%${req.query.search}%' 
                        OR product.updated_at LIKE '%${req.query.search}%'`;
      } else if (req.query?.status) {
        if (req.query.status === "0") {
          whereClause = "WHERE product_status.status_value = 0";
        } else if (req.query.status === "1") {
          whereClause = "WHERE product_status.status_value = 1";
        } else {
          whereClause = whereClause;
        }
      }

      const listPerPage = parseInt(req.params.numberPerPage);
      const currentPage = parseInt(req.params.page);
      const totalRecords = await getTotalRecords(
        "product",
        "INNER JOIN product_status ON product.status = product_status.id",
        whereClause
      );
      const numberOfPages = Math.ceil(
        totalRecords.numberOfRecords / listPerPage
      );
      const firstIndex = (currentPage - 1) * listPerPage;

      const filteredData = await getProductInformation(
        firstIndex,
        listPerPage,
        orderByClause,
        whereClause
      );
      response.success = true;
      response.result = filteredData;
      response.totalPages = numberOfPages;
      response.currentPage = currentPage;
      response.totalRecords = totalRecords.numberOfRecords;

      req.preparedResponse = response;
      next();
    } else if (req.query?.search) {
      const orderByClause = "ORDER BY status ASC, created_at ASC";

      const whereClause = `WHERE product.product_id LIKE '%${req.query.search}%' 
                            OR product.product_name LIKE '%${req.query.search}%' 
                            OR product.company_name LIKE '%${req.query.search}%' 
                            OR product.created_at LIKE '%${req.query.search}%' 
                            OR product.updated_at LIKE '%${req.query.search}%'`;
      const data = await getProductInformation(
        0,
        10,
        orderByClause,
        whereClause
      );
      response.success = true;
      response.result = data;

      req.preparedResponse = response;
      next();
    } else if (req.query?.validate) {
      const orderByClause = "ORDER BY status ASC, created_at ASC";

      const whereClause = `WHERE product.product_id = '${req.query.validate}'`;
      const data = await getProductInformation(
        0,
        10,
        orderByClause,
        whereClause
      );
      response.success = true;
      response.result = data;

      req.preparedResponse = response;
      next();
    } else {
      req.preparedResponse = response;
      next();
    }
  } catch (error) {
    next(error);
  }
};
