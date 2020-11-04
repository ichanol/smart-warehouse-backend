/**
 *   @DESCRIPTION   -   Update the information of specific product
 *   @ROUTE         -   [PUT] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const { updateProductInformation } = require("../../services");

const updateProduct = async (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
    } = req.body;

    const result = await updateProductInformation(
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status
    );

    if (result) {
      res.json({
        success: true,
        message: "Update product information successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update product information",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = updateProduct;
