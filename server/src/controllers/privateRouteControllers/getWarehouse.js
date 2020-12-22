/**
 *   @DESCRIPTION   -   Get the list of warehouse
 *   @ROUTE         -   [GET] /api/smart-warehouse/warehouse
 *   @ACCESS        -   PRIVATE
 */

const { getWarehouseList, getWarehouseSubArea } = require("../../services");

const getWarehouse = async (req, res, next) => {
  try {
    if (req.query.getWarehouseArea) {
      const result = await getWarehouseSubArea(req.query.getWarehouseArea);
      if (result) {
        res.json({ success: true, result });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    } else {
      const result = await getWarehouseList();
      if (result) {
        res.json({ success: true, result });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getWarehouse;
