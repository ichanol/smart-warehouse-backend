/**
 *   @DESCRIPTION   -   Create new product
 *   @ROUTE         -   [POST] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const createProductHandler = require("../../models/createProductHandler");
const { saveActivity, getUserId } = require("../../services");

const createProduct = async (req, res, next) => {
  try {
    const io = require("../../../server");

    const { product_id, product_name } = req.body;

    const { success } = await createProductHandler(req);

    if (success) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new product",
      });
      const userId = await getUserId(req.decodedUsername);
      const activityDetail = `${req.decodedUsername} create a new product. ${product_name}(${product_id}) created.`;
      const saveActivityResult = await saveActivity(userId, 6, activityDetail);
      if (saveActivityResult) {
        io.emit("ACTIVITY_LOG", {
          message: activityDetail,
          time: Date.now(),
        });
      }
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
