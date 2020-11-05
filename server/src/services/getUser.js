const connection = require("../Database_connection/connect");

const getUser = async (
  whereClause = "",
  orderByClause = "",
  limitClause = ""
) => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT user.username, 
                        user.firstname, 
                        user.lastname, 
                        user.detail, 
                        user.created_at, 
                        user.updated_at, 
                        user_status.status_value AS status, 
                        role.role_name 
                FROM user INNER JOIN role 
                ON user.role = role.id 
                INNER JOIN user_status
                ON user.status = user_status.id WHERE NOT (user.id = 1)
                ${whereClause} ${orderByClause} ${limitClause}`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getUser;
