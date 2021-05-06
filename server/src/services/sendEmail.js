const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = (mailOptions) => {
  console.log({
    user: process.env.NODEMAILER_MOCK_EMAIL,
    pass: process.env.NODEMAILER_MOCK_PASSWORD,
  })
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_MOCK_EMAIL,
      pass: process.env.NODEMAILER_MOCK_PASSWORD,
    },
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log(info);
  });
};

module.exports = sendEmail;
