/**
 *   @DESCRIPTION   -   Delete / remove specific product
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const { disableProduct, saveActivity, getUserId } = require("../../services");

const deleteProduct = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { product_id, detail, status } = req.body.source;

    const result = await disableProduct(product_id, detail, status);
    if (result) {
      res.json({
        success: true,
        message: "Remove product successfully",
      });

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${
        req.decodedUsername
      } update product. ${product_id}'s ${status ? "active" : "inactive"}.`;
      const saveActivityResult = await saveActivity(userId, 9, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to remove product",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = deleteProduct;
