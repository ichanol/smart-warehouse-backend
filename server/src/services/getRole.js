const connection = require("../Database_connection/connect");

const getRole = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
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
                  ${whereClause} ${orderByClause} ${limitClause}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getRole;
