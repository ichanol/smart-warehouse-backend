const nodemailer = require("nodemailer");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const csv = require("fast-csv");

const {
  getEmail,
  insertProductInformationFromFileToProductTable,
  insertCurrentProductBalanceFromFile,
} = require("../../services");

const uploadFile = async (req, res, next) => {
  const data = [];
  const fileExtension = req.file.originalname.split(".")[1];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chanatip.ras@mail.kmutt.ac.th", // your email
      pass: "Chanatip733.", // your email password
    },
  });

  const mailList = await getEmail();

  const mailOptions = {
    from: "chanatip.ras@mail.kmutt.ac.th", // sender
    to: mailList, // list of receivers
    subject: "Hello from node express server @" + Date.now(), // Mail subject
    html: "<b>Do you receive this mail?</b><br/><a>55555555<a/>", // HTML body
  };

  const sendEmail = () =>
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log(info);
    });

  const readExcel = async (filePath) => {
    const rows = await readXlsxFile(filePath);
    rows.shift();
    data.push(rows);
  };

  const readCSV = (filePath) => {
    const stream = fs.createReadStream(filePath);
    const csvData = [];
    const csvStream = csv
      .parse()
      .on("data", (result) => {
        csvData.push(result);
      })
      .on("end", async () => {
        csvData.shift();
        data.push(csvData);
      });
    stream.pipe(csvStream);
  };

  if (fileExtension === "xlsx") {
    await readExcel(req.file.path);
  } else if (fileExtension === "csv") {
    await readCSV(req.file.path);
  }

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
    sendEmail();
  }
};

module.exports = uploadFile;
