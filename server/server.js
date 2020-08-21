const app = require("express")();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const io = require("socket.io")(server);
const dotenv = require("dotenv");

const connection = require("./src/Database_connection/connect.js");
const smartWarehouse = require("./src/routes/smartWarehouseRoutes");

const verifyToken = require("./src/middleware/verifyToken");
const isLoginHandler = require("./src/middleware/isLoginHandler");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

app.use([isLoginHandler, verifyToken]);

app.use(bodyParser.json());
app.use(cors());
app.use(process.env.API_PATH, smartWarehouse);

app.use([errorHandler]);

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

server.listen(process.env.PORT, () => {
  d = new Date();
  utc = d.getTime() + d.getTimezoneOffset() * 60000;
  nd = new Date(utc + 3600000 * 7);

  console.log(`[ SERVER IS RUNNING ON PORT ${process.env.PORT} ${nd}]`);
});
