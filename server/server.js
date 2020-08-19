const app = require("express")();
const server = require("http").createServer(app);
const mysql = require("mysql");

const PORT = 8000;

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("[DATABASE CONNECTED]");
});

app.get("/", (req, res) => {
  console.log("new visit");
  const sql = `INSERT INTO user(username,first_name,last_name,password,role)VALUES("mockuser","mockfirstname","mocklastname","mockpassword",1)`;
  connection.query(sql, (err, result, field) => {
    console.log("result: ", result);
    console.log("err: ", err);
    console.log("field: ", field);
  });

  const SQL = `SELECT * FROM user`;
  connection.query(SQL, (err, result, field) => {
    if (err) throw err;
    console.log("RESPONSE: ", result);
    res.json(result);
  });
});

server.listen(PORT, () => {
  console.log(`[ SERVER IS RUNNING ON PORT ${PORT} ]`);
});
