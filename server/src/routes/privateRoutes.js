const express = require("express");
const router = express.Router();
const {
  readRFID,
  userLogOut,
} = require("../controllers/privateRoutesControllers");
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
  getTransaction,
  generatePDF,
  getImportExportProductActions
} = require("../controllers/privateRouteControllers");

router.route("/logout").post(userLogOut);
router.route("/import-export-product").post(importExportProduct).get(getImportExportProductActions);
router.route("/read-rfid").get(readRFID);
router.route("/product-transaction").get(getTransaction);
router.route("/product-balance").get(currentProductBalance);
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
router.route("/generate-pdf/:reference_number?").get(generatePDF);

module.exports = router;
