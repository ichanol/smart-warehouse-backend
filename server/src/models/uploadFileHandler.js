const {
  getEmail,
  insertProductInformationFromFileToProductTable,
  insertCurrentProductBalanceFromFile,
  readCSV,
  readXLSX,
  sendEmail,
  insertRoleInformationFromFileToRoleTable,
  insertUserInformationFromFileToUserTable,
} = require("../services");

const uploadFileHandler = async (req) => {
  const data = [];
  const fileExtension = req.file.originalname.split(".")[1];
  let success = false;

  const mailList = await getEmail();

  const mailOptions = {
    from: "chanatip.ras@mail.kmutt.ac.th",
    to: mailList,
    subject: "New data added",
    html: `${req.decodedUsername} has uploaded new file. ${Date.now()}`,
  };

  if (fileExtension === "xlsx") {
    data.push(await readXLSX(req.file.path));
  } else if (fileExtension === "csv") {
    data.push(await readCSV(req.file.path));
  }

  if (req.params.type === "user") {
    const insertUserResult = await insertUserInformationFromFileToUserTable(
      data
    );
    if (insertUserResult) {
      success = true;
    }
  } else if (req.params.type === "product") {
    const insertProductResult = await insertProductInformationFromFileToProductTable(
      data
    );

    const dataForCurrentProductBalance = data[0].map((value, index) => {
      const temp = [];
      temp.push(insertProductResult + index, value[3]);
      return temp;
    });

    const insertCurrentProductBalanceResult = await insertCurrentProductBalanceFromFile(
      dataForCurrentProductBalance
    );

    if (insertProductResult && insertCurrentProductBalanceResult) {
      success = true;
    }
  } else if (req.params.type === "role") {
    const insertRoleResult = await insertRoleInformationFromFileToRoleTable(
      data
    );
    if (insertRoleResult) {
      success = true;
    }
  }

  if (success) {
    sendEmail(mailOptions);
  }
  return success;
};

module.exports = uploadFileHandler;
