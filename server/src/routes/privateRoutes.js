const express = require("express");
const router = express.Router();
const {
  createProduct,
  createRole,
  createUser,
  getUser,
  deleteProduct,
  deleteRole,
  deleteUser,
  exportProduct,
  getProduct,
  getRole,
  importProduct,
  productBalance,
  productTransaction,
  readRFID,
  updateProduct,
  updateRole,
  updateUser,
  userLogOut,
} = require("../controllers/privateRoutesControllers");

//------------------- WEB APPLICATION -------------------
router.route("/logout").post(userLogOut);
router.route("/import-product").post(importProduct);
router.route("/export-product").post(exportProduct);
router.route("/read-rfid").get(readRFID);
router.route("/product-transaction").get(productTransaction);
router.route("/product-balance").get(productBalance);

// ADMIN ONLY
router
  .route("/users")
  .get(getUser)
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser);
router
  .route("/products")
  .get(getProduct)
  .post(createProduct)
  .put(updateProduct)
  .delete(deleteProduct);
router
  .route("/roles")
  .get(getRole)
  .post(createRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;

/* 

router.get("/checktoken", authenticateToken, (req, res) => {
  res.send("some content " + req.username);
});

router.post("/newToken", (req, res) => {
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
}); */

/* 
router.post("/detectUserRFID", (req, res) => {
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
      //res.sendStatus(200);
      console.log(`[ ACCESS GRANTED ] ${username} can login to platform`);
      io.in(username).emit("USER_GRANTED", {
        message: `[access granted]`,
        granted: true,
        room: username,
      });
      res.send(generateAccessToken({ username }));
    }
  });
}); */
