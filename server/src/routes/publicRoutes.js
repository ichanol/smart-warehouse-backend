const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const {
  createProduct,
  reNewToken,
} = require("../controllers/publicRoutesControllers");
const verifyTokenHandler = require("../middleware/verifyTokenHandler");
const isLoginHandler = require("../middleware/isLoginHandler");

const { detectUserId, detectProductId, userLogin } = require("../controllers/publicRouteControllers");

/**  @WebApplication */
router.route("/login").post(userLogin);

/**  @Hardware */
router.route("/detect-user-rfid").post(detectUserId);
router.route("/detect-product-rfid").post(detectProductId);

/**  @MOCK_REQUEST */
router.route("/create-product/:number").get(createProduct);

/**
 *   @DESCRIPTION - Add middleware to check wheather user has token attached in the request or not,
 *                  If has then check the refresh token wheather it is valid or not,
 *                  If refresh token is valid, Generate new access token and refresh token
 * */
router.get(
  "/renewtoken",
  [isLoginHandler, verifyTokenHandler(process.env.REFRESHER_TOKEN)],
  reNewToken
);

module.exports = router;
