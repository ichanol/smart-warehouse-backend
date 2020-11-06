const getCurrentProductBalance = require("./getCurrentProductBalance");
const getTotalNumberOfRecords = require("./getTotalNumberOfRecords");
const getProduct = require("./getProduct");
const createNewProduct = require("./createNewProduct");
const updateProductInformation = require("./updateProductInformation");
const disableProduct = require("./disableProduct");
const createNewCurrentProductBalanceRecord = require("./createNewCurrentProductBalanceRecord");

module.exports = {
  getCurrentProductBalance,
  getTotalNumberOfRecords,
  getProduct,
  createNewProduct,
  updateProductInformation,
  disableProduct,
  createNewCurrentProductBalanceRecord,
};
