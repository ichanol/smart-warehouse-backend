const express = require("express");
const router = express.Router();
const {
  readRFID,
  userLogOut,
} = require("../controllers/privateRoutesControllers");
const getProductHandler = require("../models/getProductHandler");
const getRoleHandler = require("../models/getRoleHandler");

const {
  currentProductBalance,
  getProductManagement,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserManagement,
  createUser,
  updateUser,
  deleteUser,
  getRoleManagement,
  createRole,
  updateRole,
  deleteRole,
  importExportProduct,
  getTransaction
} = require("../controllers/privateRouteControllers");

//------------------- WEB APPLICATION -------------------
router.route("/logout").post(userLogOut);
router.route("/import-export-product").post(importExportProduct);
router.route("/read-rfid").get(readRFID);
router.route("/product-transaction").get(getTransaction);
router.route("/product-balance").get(currentProductBalance);

// ADMIN ONLY
router
  .route("/users")
  .get(getUserManagement)
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser);
router
  .route("/products")
  .get(getProductManagement)
  .post(createProduct)
  .put(updateProduct)
  .delete(deleteProduct);
router
  .route("/roles")
  .get(getRoleManagement)
  .post(createRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
