module.exports = login = async (
  mysql,
  connection,
  username,
  password = false
) => {
  const loginValidation = () => {
    return new Promise((resolve, reject) => {
      let SQL = `SELECT username FROM user WHERE username = ${mysql.escape(
        username
      )}`;
      if (password) {
        SQL = SQL + `AND password = ${mysql.escape(password)}`;
      }
      connection.query(SQL, (error, result, field) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const loginResult = await loginValidation();

  if (loginResult.length === 1) {
    console.log(username, "login");
    return true;
  } else {
    return false;
  }
};
