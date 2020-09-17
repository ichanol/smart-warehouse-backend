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
  getProduct,
  getRole,
  productBalance,
  productTransaction,
  readRFID,
  updateProduct,
  updateRole,
  updateUser,
  userLogOut,
  updateTransaction,
  checkIsLogIn,
} = require("../controllers/privateRoutesControllers");

//------------------- WEB APPLICATION -------------------
router.route("/check-login").get(checkIsLogIn);
router.route("/logout").post(userLogOut);
router.route("/import-export-product").post(updateTransaction);
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
