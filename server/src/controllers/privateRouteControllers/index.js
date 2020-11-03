const currentProductBalance = require("./currentProductBalance");
const getProductManagement = require("./getProductManagement");
const createProduct = require("./createProduct");
const updateProduct = require("./updateProduct");
const deleteProduct = require("./deleteProduct");
const getUserManagement = require("./getUserManagement");
const createUser = require("./createUser");
const updateUser = require("./updateUser");

module.exports = {
  updateProduct,
  createProduct,
  currentProductBalance,
  getProductManagement,
  deleteProduct,
  getUserManagement,
  createUser,
  updateUser,
};
