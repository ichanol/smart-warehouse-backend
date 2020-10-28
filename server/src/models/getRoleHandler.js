const connection = require("../Database_connection/connect");
const getTotalRecords = require("./getTotalRecords");

const getRoleInformation = async (
  firstIndex,
  listPerPage,
  orderByClause,
  whereClause
) => {
  return new Promise((resolve, reject) => {
    console.log("active", whereClause);
    let SQL = `SELECT 
                ROLE.id,
                ROLE.role_name,
                ROLE.detail,
                ROLE.created_at,
                ROLE.updated_at,
                ROLE.permission,
                role_status.status_value AS status,
                (SELECT COUNT(*) AS numberOfRecords FROM user INNER JOIN role ON user.role = role.id WHERE user.role = ROLE.id ) AS totalUser 
                FROM role ROLE INNER JOIN role_status ON ROLE.status = role_status.id 
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

module.exports = getRole = async (req, res, next) => {
  try {
    let response = {
      success: false,
      result: null,
      totalPages: null,
      currentPage: null,
      totalRecords: null,
    };

    if (req.params?.numberPerPage && req.params?.page) {
      let orderByClause = "ORDER BY ROLE.status ASC, ROLE.created_at ASC";
      let whereClause = "";

      if (req.query?.sort) {
        const sort = req.query.sort.split(",");
        orderByClause = `ORDER BY ROLE.status ASC, ${sort[0]} ${
          sort[1] === "true" ? "DESC" : "ASC"
        }`;
      }

      if (req.query?.search && req.query?.status) {
        whereClause = `WHERE (ROLE.role_name LIKE '%${req.query.search}%' 
                        OR ROLE.created_at LIKE '%${req.query.search}%' 
                        OR ROLE.updated_at LIKE '%${req.query.search}%')`;
        if (req.query.status === "0") {
          whereClause = whereClause + " AND role_status.status_value = 0";
        } else if (req.query.status === "1") {
          whereClause = whereClause + " AND role_status.status_value = 1";
        } else {
          whereClause = whereClause;
        }
      } else if (req.query?.search) {
        whereClause = `WHERE (ROLE.role_name LIKE '%${req.query.search}%' 
                        OR ROLE.created_at LIKE '%${req.query.search}%' 
                        OR ROLE.updated_at LIKE '%${req.query.search}%')`;
        console.log("search condition");
      } else if (req.query?.status) {
        if (req.query.status === "0") {
          whereClause = "WHERE role_status.status_value = 0";
        } else if (req.query.status === "1") {
          whereClause = "WHERE role_status.status_value = 1";
        } else {
          whereClause = whereClause;
        }
      }

      const listPerPage = parseInt(req.params.numberPerPage);
      const currentPage = parseInt(req.params.page);
      const totalRecords = await getTotalRecords(
        "role ROLE",
        "INNER JOIN role_status ON ROLE.status = role_status.id",
        whereClause
      );
      const numberOfPages = Math.ceil(
        totalRecords.numberOfRecords / listPerPage
      );
      const firstIndex = (currentPage - 1) * listPerPage;

      const filteredData = await getRoleInformation(
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
      const orderByClause = "ORDER BY ROLE.status ASC, ROLE.created_at ASC";

      const whereClause = `WHERE (ROLE.role_name LIKE '%${req.query.search}%' 
                            OR ROLE.created_at LIKE '%${req.query.search}%' 
                            OR ROLE.updated_at LIKE '%${req.query.search}%')`;
      const data = await getRoleInformation(0, 10, orderByClause, whereClause);
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
