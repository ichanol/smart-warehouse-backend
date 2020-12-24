const { topExportProduct, topImportProduct, getActivityLogs } = require("../services");

const dashboardHandler = async (req) => {
  const response = { success: false, result: {} };
  const topImportResult = await topImportProduct();
  const topExportResult = await topExportProduct();
  const activityLogs = await getActivityLogs();
  if (topImportResult && topExportResult) {
    response.success = true;
    response.result = { topImportResult, topExportResult, activityLogs };
  }
  return response;
};

module.exports = dashboardHandler;
