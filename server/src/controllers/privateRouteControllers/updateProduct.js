/**
 *   @DESCRIPTION   -   Update the information of specific product
 *   @ROUTE         -   [PUT] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const {
  updateProductInformation,
  saveActivity,
  getUserId,
} = require("../../services");

const updateProduct = async (req, res, next) => {
  try {
    const io = require("../../../server");

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

      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} update ${product_id}'s information.`;
      const saveActivityResult = await saveActivity(userId, 9, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
          id: 9,
          username: req.decodedUsername,
        });
      }
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
