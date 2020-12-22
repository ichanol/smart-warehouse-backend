const express = require("express");
const router = express.Router();
const multer = require("multer");

global.__basedir = "/app";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/upload/");
  },
  filename: (req, file, cb) => {
    console.log("MULTER", file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

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
  getImportExportProductActions,
  updateTransaction,
  uploadFile,
  downloadTemplate,
  getWarehouse,
} = require("../controllers/privateRouteControllers");

//------------------- WEB APPLICATION -------------------
router.route("/logout").post(userLogOut);
router
  .route("/import-export-product")
  .post(importExportProduct)
  .get(getImportExportProductActions);
router.route("/read-rfid").get(readRFID);
router
  .route("/product-transaction")
  .get(getTransaction)
  .post(updateTransaction);
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
router.route("/warehouse").get(getWarehouse);

router
  .route("/uploadfile/:type")
  .get(downloadTemplate)
  .post([upload.single("uploadDocument"), uploadFile]);

module.exports = router;
