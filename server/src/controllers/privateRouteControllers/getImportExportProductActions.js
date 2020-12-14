/**
 *   @DESCRIPTION   -   Get the list of import export product actions
 *   @ROUTE         -   [GET] /api/smart-warehouse/import-export-product
 *   @ACCESS        -   PRIVATE
 */

const { getImportExportAction } = require("../../services");

const getImportExportProductActions = async (req, res, next) => {
  try {
    const result = await getImportExportAction();
    if (result) {
      res.json({ success: true, result });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Can't get the information" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getImportExportProductActions;
