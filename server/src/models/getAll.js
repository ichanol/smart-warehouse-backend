const connection = require("../Database_connection/connect");

module.exports = getAll = async (TABLE, sortDirection, columnName, keyword, role, mysql) => {

  const search = (result) => {
    return searchResult = result.filter(row =>
      row.firstname.toLowerCase().indexOf(keyword) > -1 ||
      row.lastname.toLowerCase().indexOf(keyword) > -1 ||
      row.username.toLowerCase().indexOf(keyword) > -1
    )
  }

  const queryData = () => {
    let whereClause;
    if (role !== null) {
      whereClause = `WHERE role_name = ${mysql.escape(role)}`
    } else {
      whereClause = ''
    }

    return new Promise((resolve, reject) => {
      const SQL = `
      SELECT user.id,
             user.firstname,
             user.lastname,
             user.username,
             user.status,
             role.role_name
      FROM ${TABLE} 
      LEFT JOIN role ON user.role = role.id
      ${whereClause}
      Order By ${columnName} ${sortDirection}`;
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const result = await queryData();
  if (result.length >= 1) {
    search(result)
    return keyword !== null ? searchResult : result;
  } else {
    return false;
  }
};