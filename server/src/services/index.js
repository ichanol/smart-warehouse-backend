const getEmail = require("./getEmail");
const insertProductInformationFromFileToProductTable = require("./insertProductInformationFromFileToProductTable");
const insertCurrentProductBalanceFromFile = require("./insertCurrentProductBalanceFromFile");
const readCSV = require("./readCSV");
const readXLSX = require("./readXLSX");
const sendEmail = require("./sendEmail");
const insertRoleInformationFromFileToRoleTable = require("./insertRoleInformationFromFileToRoleTable");
const insertUserInformationFromFileToUserTable = require("./insertUserInformationFromFileToUserTable");

module.exports = {
  getEmail,
  insertProductInformationFromFileToProductTable,
  insertCurrentProductBalanceFromFile,
  readCSV,
  readXLSX,
  sendEmail,
  insertRoleInformationFromFileToRoleTable,
  insertUserInformationFromFileToUserTable,
};
