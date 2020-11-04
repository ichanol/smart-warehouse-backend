/**
 *   @DESCRIPTION   -   Delete / remove specific product
 *   @ROUTE         -   [DELETE] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const { disableProduct } = require("../../services");

const deleteProduct = async (req, res, next) => {
  try {
    const { product_id, detail, status } = req.body.source;

    const result = await disableProduct(product_id, detail, status);
    if (result) {
      res.json({
        success: true,
        message: "Remove product successfully",
      });
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
