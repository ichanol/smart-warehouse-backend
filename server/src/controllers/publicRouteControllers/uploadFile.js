const nodemailer = require("nodemailer");
const readXlsxFile = require("read-excel-file/node");
const fs = require('fs');
const csv = require("fast-csv");
const { getEmail, insertInformationFromFile } = require("../../services");

const uploadFile = async (req, res, next) => {
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

  const importExcelData2MySQL = async (filePath) => {
    const rows = await readXlsxFile(filePath);
    rows.shift();
    const result = await insertInformationFromFile(rows);
    if (result) {
      sendEmail();
    }
  };

  const importCsvData2MySQL = (filePath) => {
    const stream = fs.createReadStream(filePath);
    const csvData = [];
    const csvStream = csv
      .parse()
      .on("data", (data) => {
        csvData.push(data);
      })
      .on("end", async () => {
        csvData.shift();
        const result = await insertInformationFromFile(csvData);
        if (result) {
          sendEmail();
        }
      });
    stream.pipe(csvStream);
  };

  if (fileExtension === "xlsx") {
    importExcelData2MySQL(req.file.path);
  } else if (fileExtension === "csv") {
    console.log("CSV");
    importCsvData2MySQL(req.file.path);
  }
};

module.exports = uploadFile;
