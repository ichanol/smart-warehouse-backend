/**
 *   @DESCRIPTION   -   Get the list of all registered product
 *   @ROUTE         -   [GET] /api/smart-warehouse/products
 *   @ACCESS        -   PRIVATE (admin)
 */

const getProductManagement = async (req, res, next) => {
  try {
    const getProductHandler = require("../../models/getProductHandler");
    const result = await getProductHandler(req);
    
  } catch (error) {
    next(error);
  }
  //   res.json(req.preparedResponse);
};

module.exports = getProductManagement;
