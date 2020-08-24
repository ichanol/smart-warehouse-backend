const express = require("express");
const router = express.Router();
const { userLogIn } = require("../controllers/smartWarehouseControllers");

//------------------- WEB APPLICATION -------------------
router.route("/login").post(userLogIn);

module.exports = router;
