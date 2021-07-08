const nodemailer = require("nodemailer");
const fs = require('fs').promises;
require("dotenv").config();

exports.validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions);
};

exports.sendTestEmail = async () => {
  const mailOptions = {
    from: process.env.EMAIL_ALIAS,
    to: "ben@bdarnell.com", // edit this to your email to test
    subject: "sb hacks email testing",
    text: "nice it worked",
    html: await fs.readFile("templates/confirm.html"),
  };

  return exports.sendEmail(mailOptions);
};
