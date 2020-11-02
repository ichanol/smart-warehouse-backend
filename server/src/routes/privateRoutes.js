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
  productTransaction,
  readRFID,
  updateProduct,
  updateRole,
  updateUser,
  userLogOut,
  updateTransaction,
} = require("../controllers/privateRoutesControllers");
const getProductHandler = require("../models/getProductHandler");
const getRoleHandler = require("../models/getRoleHandler");

const {
  currentProductBalance,
} = require("../controllers/privateRouteControllers");

//------------------- WEB APPLICATION -------------------
router.route("/logout").post(userLogOut);
router.route("/import-export-product").post(updateTransaction);
router.route("/read-rfid").get(readRFID);
router.route("/product-transaction").get(productTransaction);
router.route("/product-balance").get(currentProductBalance);

// ADMIN ONLY
router
  .route("/users")
  .get(getUser)
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser);
router
  .route("/products/:numberPerPage?/:page?")
  .get([getProductHandler, getProduct])
  .post(createProduct)
  .put(updateProduct)
  .delete(deleteProduct);
router
  .route("/roles/:numberPerPage?/:page?")
  .get([getRoleHandler, getRole])
  .post(createRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
