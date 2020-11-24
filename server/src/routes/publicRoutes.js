const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const {
  userLogIn,
  detectedProductRFID,
  createProduct,
  reNewToken,
  uploadFiles,
} = require("../controllers/publicRoutesControllers");
const verifyTokenHandler = require("../middleware/verifyTokenHandler");
const isLoginHandler = require("../middleware/isLoginHandler");

const { detectUserId } = require("../controllers/publicRouteControllers");

/**  @WebApplication */
router.route("/login").post(userLogIn);

/**  @Hardware */
router.route("/detect-user-rfid").post(detectUserId);
router.route("/detect-product-rfid").post(detectedProductRFID);

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

router.route("/uploadfile").post(uploadFiles);

module.exports = router;
