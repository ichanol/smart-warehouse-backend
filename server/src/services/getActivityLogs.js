const connection = require("../Database_connection/connect");

const getActivityLogs = async () => {
  return new Promise((resolve, reject) => {
    const SQL = `SELECT user.username, 
                        activity_log.detail AS activity_detail, 
                        activity_type.name AS activity_name, 
                        activity_type.id AS activity_id,
                        activity_log.created_at
                FROM activity_log
                INNER JOIN user
                ON user.id = activity_log.user
                INNER JOIN activity_type
                ON activity_type.id = activity_log.activity ORDER BY activity_log.created_at DESC LIMIT 0,50`;
    connection.query(SQL, (error, result, field) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = getActivityLogs;
