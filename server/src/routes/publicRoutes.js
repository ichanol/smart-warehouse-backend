const express = require("express");
const router = express.Router();
const {
  userLogIn,
  detectedProductRFID,
  detectedUserRFID,
  createProduct
} = require("../controllers/publicRoutesControllers");

/** @WebApplication */
router.route("/login").post(userLogIn);

/** @Hardware */
router.route("/detect-user-rfid").post(detectedUserRFID);
router.route("/detect-product-rfid").post(detectedProductRFID);



/** @MOCK_REQUEST */
router.route("/create-product/:number").get(createProduct);

module.exports = router;
