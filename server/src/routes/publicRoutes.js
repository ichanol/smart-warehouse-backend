const express = require("express");
const dotenv = require("dotenv");

const {
  detectUserId,
  detectProductId,
  userLogin,
  renewToken,
} = require("../controllers/publicRouteControllers");

const verifyTokenHandler = require("../middleware/verifyTokenHandler");
const isLoginHandler = require("../middleware/isLoginHandler");

const router = express.Router();

dotenv.config();


/**  @WebApplication */
router.route("/login").post(userLogin);

/**  @Hardware */
router.route("/detect-user-rfid").post(detectUserId);
router.route("/detect-product-rfid").post(detectProductId);

/**
 *   @DESCRIPTION - Add middleware to check wheather user has token attached in the request or not,
 *                  If has then check the refresh token wheather it is valid or not,
 *                  If refresh token is valid, Generate new access token and refresh token
 * */
router.get(
  "/renewtoken",
  [isLoginHandler, verifyTokenHandler(process.env.REFRESHER_TOKEN)],
  renewToken
);

module.exports = router;
