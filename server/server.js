const app = require("express")();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const io = require("socket.io")(server);
const dotenv = require("dotenv");

const connection = require("./src/Database_connection/connect.js");
const smartWarehouseRoutes = require("./src/routes/smartWarehouseRoutes");
const loginRoutes = require("./src/routes/LoginRoutes");

const verifyTokenHandler = require("./src/middleware/verifyTokenHandler");
const isLoginHandler = require("./src/middleware/isLoginHandler");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

app.use(bodyParser.json());
app.use(cors());

//  Path for log in only
//  We don't use isLoginHandler, verifyTokenHandler middleware
//  Access denied because user don't have token and authorization header
//  That's why they needed to log in to get the token
app.use(process.env.API_PATH, loginRoutes);


//  Another path for API after user's logged in
//  We use isLoginHandler to check wheather user has token or not
//  If user has token, we use verifyTokenHandler to validate that token
app.use([isLoginHandler, verifyTokenHandler]);
app.use(process.env.API_PATH, smartWarehouseRoutes);

//  We use errorHandler middleware to send error message if there's any error
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
