const express = require("express");
const router = express.Router();
const {
  userLogIn,
  detectedProductRFID,
  detectedUserRFID,
} = require("../controllers/publicRoutesControllers");

/** @WebApplication */
router.route("/login").post(userLogIn);

/** @Hardware */
router.route("/detect-user-rfid").post(detectedUserRFID);
router.route("/detect-product-rfid").post(detectedProductRFID);

module.exports = router;
