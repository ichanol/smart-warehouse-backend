const getCurrentProductBalance = require("./getCurrentProductBalance");
const getTotalNumberOfRecords = require("./getTotalNumberOfRecords");
const getProduct = require("./getProduct");
const createNewProduct = require("./createNewProduct");
const updateProductInformation = require("./updateProductInformation");
const disableProduct = require("./disableProduct");
const getUser = require("./getUser");
const createNewUser = require("./createNewUser");
const updateUserInformation = require("./updateUserInformation");
const disableUser = require("./disableUser");
const getRole = require("./getRole");
const createNewRole = require("./createNewRole");
const updateRoleInformation = require("./updateRoleInformation");
const disableRole = require("./disableRole");
const getImportExportProductActionType = require("./getImportExportProductActionType");
const getProductBalanceForUpdate = require("./getProductBalanceForUpdate");
const getUserId = require("./getUserId");
const updateCurrentProductBalance = require("./updateCurrentProductBalance");
const createTransactionByArray = require("./createTransactionByArray");
const createNewCurrentProductBalanceRecord = require("./createNewCurrentProductBalanceRecord");
const getRoleName = require("./getRoleName");
const getTransactionLog = require("./getTransactionLog");
const getTransactionRecord = require("./getTransactionRecord");
const getTotalNumberOfRecordsForTransaction = require("./getTotalNumberOfRecordsForTransaction");
const createTransactionRecord = require("./createTransactionRecord");
const getTransactionId = require("./getTransactionId");
const getRolePermission = require("./getRolePermission");
const updateRolePermission = require("./updateRolePermission");
const validateUserIdCard = require("./validateUserIdCard");

module.exports = {
  getCurrentProductBalance,
  getTotalNumberOfRecords,
  getProduct,
  createNewProduct,
  updateProductInformation,
  disableProduct,
  getUser,
  createNewUser,
  updateUserInformation,
  disableUser,
  getRole,
  createNewRole,
  updateRoleInformation,
  disableRole,
  getImportExportProductActionType,
  getProductBalanceForUpdate,
  getUserId,
  updateCurrentProductBalance,
  createTransactionByArray,
  createNewCurrentProductBalanceRecord,
  getRoleName,
  getTransactionLog,
  getTransactionRecord,
  getTotalNumberOfRecordsForTransaction,
  createTransactionRecord,
  getTransactionId,
  getRolePermission,
  updateRolePermission,
  validateUserIdCard,
};
