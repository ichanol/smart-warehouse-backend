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
const addRolePermission = require("./addRolePermission");
const getRoleId = require("./getRoleId");

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
  addRolePermission,
  getRoleId,
};
