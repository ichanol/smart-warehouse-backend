const app = require("express")();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const io = require("socket.io")(server);
const dotenv = require("dotenv").config();

const connection = require("./src/Database_connection/connect");

app.use(bodyParser.json());
app.use(cors());

const PORT = 8000;

//------------------- Connection -------------------

connection.connect(function (err) {
  if (err) throw err;
  console.log("[DATABASE CONNECTED]");
});

io.on("connection", (socket) => {
  console.log("connected to web socket!");

  socket.on("join_room", ({ room }) => {
    socket.leaveAll();
    socket.join(room);
    console.log("join room:", room);
  });

});

//------------------- WEB APPLICATION -------------------

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("HEADER TOKEN:", token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, username) => {
    console.log(err);
    console.log(username);
    if (err) return res.sendStatus(403);
    req.username = username;
    next();
  });
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const SQL = `SELECT username FROM user WHERE username = ${mysql.escape(
    username
  )} AND password = ${mysql.escape(password)}`;
  connection.query(SQL, (err, result, field) => {
    if (err) res.status(500).send("MYSQL error");
    if (result.length === 1) {
      const accessToken = generateAccessToken({ username });
      const refreshToken = jwt.sign({ username }, process.env.REFRESHER_TOKEN, {
        expiresIn: "60s",
      });
      res.json({ accessToken, refreshToken });
    } else {
      res.status(404).send("Username or password incorrect");
    }
  });
});

app.get("/checktoken", authenticateToken, (req, res) => {
  res.send("some content " + req.username);
});

app.post("/newToken", (req, res) => {
  const refreshToken = req.body.token;
  const token = refreshToken && refreshToken.split(" ")[1];
  console.log("REFRESHTOKEN: ", refreshToken, "****:", token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESHER_TOKEN, (err, username) => {
    console.log(err);
    console.log(username);
    if (err) return res.sendStatus(403);
    const newAccessToken = generateAccessToken({ username });
    const newRefreshToken = jwt.sign(
      { username },
      process.env.REFRESHER_TOKEN,
      { expiresIn: "60s" }
    );
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
});

//------------------- HARDWARE -------------------

app.post("/detectUserRFID", (req, res) => {
  console.log("[ NEW POST REQUEST FROM DEVICE ]");
  const username = req.query.username;
  const sql = `SELECT username FROM user WHERE username =  ${mysql.escape(
    username
  )}`;

  connection.query(sql, (err, result, fields) => {
    if (err) {
      res.sendStatus(500);
      console.log("[ ERROR ] post request /detectUserRFID");
    } else if (typeof result[0] === "undefined") {
      res.sendStatus(404);
      console.log(`[ ERROR ] user with username "${username}" not found`);
    } else {
      res.sendStatus(200);
      console.log(`[ ACCESS GRANTED ] ${username} can login to platform`);
      io.in(username).emit("USER_GRANTED", {
        message: `[access granted]`,
        granted: true,
        room: username,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`[ SERVER IS RUNNING ON PORT ${PORT} ]`);
});
