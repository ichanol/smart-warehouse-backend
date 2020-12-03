const {
  generatePDFfile,
  getTransactionLog,
  getTransactionRecord,
  getUser,
} = require("../services");
const mysql = require("mysql");

const generatePDFHandler = async (referenceNumber) => {
  const transactionDetail = await getTransactionRecord(
    `WHERE inventory_log.reference_number = ${referenceNumber}`
  );
  const productList = await getTransactionLog(
    `WHERE inventory_log.reference_number = ${referenceNumber}`
  );
  const userInformation = await getUser(
    `AND user.username = ${mysql.escape(transactionDetail[0].username)}`
  );

  const result = await generatePDFfile(
    referenceNumber,
    transactionDetail,
    productList,
    userInformation
  );

  if (result) {
    console.log(transactionDetail, productList);
    return true;
  } else {
    return false;
  }
};

module.exports = generatePDFHandler;
