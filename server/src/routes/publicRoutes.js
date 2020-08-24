const express = require("express");
const router = express.Router();
const {
  userLogIn,
  detectedProductRFID,
  detectedUserRFID,
} = require("../controllers/publicRoutesControllers");

//------------------- WEB APPLICATION -------------------
router.route("/login").post(userLogIn);

//------------------- HARDWARE -------------------
router.route("/detect-user-rfid/:username").post(detectedUserRFID);
router.route("/detect-product-rfid").post(detectedProductRFID);

module.exports = router;
