/**
 *   @DESCRIPTION   -   When hardware read the RFID tags from product successfully.
 *                      It will send request that has a data (S/N, amount, etc) embedded
 *                      in the body of the request to the server. Server will forward all
 *                      the data and information to web application
 *   @ROUTE         -   [POST] /api/smart-warehouse/detect-product-RFID/
 *   @ACCESS        -   PRIVATE (hardware)
 */

const detectProductHandler = require("../../models/detectProductHandler");

const detectProductId = async (req, res, next) => {
  try {
    const { data, username } = req.body;
    const io = require("../../../server");
    const result = await detectProductHandler(data);

    if (result) {
      io.in(username).emit("PRODUCT_SCANNER", {
        success: true,
        productData: result,
      });
      res.json({
        success: true,
        message: "HARDWARE SEND PRODUCT DATA FROM RFID TAGS",
        result,
      });
    } else {
      io.in(username).emit("PRODUCT_SCANNER", {
        success: false,
        productData: null,
        message: "Error",
      });
      res.json({
        success: false,
        message: "Failed to load product information",
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = detectProductId;
