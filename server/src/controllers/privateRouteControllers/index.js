const currentProductBalance = require("./currentProductBalance");
const getProductManagement = require("./getProductManagement");
const createProduct = require("./createProduct");
const updateProduct = require("./updateProduct");
const deleteProduct = require("./deleteProduct");
const getUserManagement = require("./getUserManagement");
const createUser = require("./createUser");
const updateUser = require("./updateUser");
const deleteUser = require("./deleteUser");
const getRoleManagement = require("./getRoleManagement");
const createRole = require("./createRole");
const updateRole = require("./updateRole");
const deleteRole = require("./deleteRole");
const importExportProduct = require("./importExportProduct");
const getTransaction = require("./getTransaction");
const generatePDF = require("./generatePDF");
const getImportExportProductActions = require("./getImportExportProductActions");
const updateTransaction = require("./updateTransaction");
const uploadFile = require("./uploadFile");
const downloadTemplate = require("./downloadTemplate");
const getWarehouse = require("./getWarehouse");
const dashboardController = require("./dashboardController");
const userLogout = require("./userLogout");

module.exports = {
  updateProduct,
  createProduct,
  currentProductBalance,
  getProductManagement,
  deleteProduct,
  getUserManagement,
  createUser,
  updateUser,
  deleteUser,
  getRoleManagement,
  createRole,
  updateRole,
  deleteRole,
  importExportProduct,
  getTransaction,
  generatePDF,
  getImportExportProductActions,
  updateTransaction,
  uploadFile,
  downloadTemplate,
  getWarehouse,
  dashboardController,
  userLogout,
};
