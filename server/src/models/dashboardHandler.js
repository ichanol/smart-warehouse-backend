const { topExportProduct, topImportProduct } = require("../services");

const dashboardHandler = async (req) => {
  const response = { success: false, result: {} };
  const topImportResult = await topImportProduct();
  const topExportResult = await topExportProduct();
  if (topImportResult && topExportResult) {
    response.success = true;
    response.result = { topImportResult, topExportResult };
  }
  return response;
};

module.exports = dashboardHandler;
