/**
 *   @DESCRIPTION   -   Create new product
 *   @ROUTE         -   [POST] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const createProductHandler = require("../../models/createProductHandler");

const createProduct = async (req, res, next) => {
  try {
    const { success } = await createProductHandler(req);

    if (success) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new product",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new product",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = createProduct;
