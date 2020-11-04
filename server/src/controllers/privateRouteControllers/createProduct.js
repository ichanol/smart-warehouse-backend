/**
 *   @DESCRIPTION   -   Create new product
 *   @ROUTE         -   [POST] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const { createNewProduct } = require("../../services");

const createProduct = async (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
    } = req.body;

    const result = await createNewProduct(
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
      req.decodedUsername
    );

    if (result) {
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
