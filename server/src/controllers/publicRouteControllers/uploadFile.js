const nodemailer = require("nodemailer");
const readXlsxFile = require("read-excel-file/node");
const { getEmail, insertInformationFromFile } = require("../../services");

const uploadFile = async (req, res, next) => {
  console.log(req.file);

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

  const importExcelData2MySQL = async (filePath) => {
    const rows = await readXlsxFile(filePath);
    rows.shift();
    const result = await insertInformationFromFile(rows);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log(info);
    });
  };
  importExcelData2MySQL(req.file.path);
};

module.exports = uploadFile;
