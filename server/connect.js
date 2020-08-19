const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("##Successfully connected to MySQL container##");
});
