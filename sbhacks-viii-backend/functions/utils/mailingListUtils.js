const nodemailer = require("nodemailer");
const fs = require('fs');
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
    to: "dguo@ucsb.edu", // edit this to your email to test
    subject: "sb hacks email testing",
    text: "nice it worked",
    html: `<a href=\"${process.env.SITE_URL}/confirm?emailAddress=dguo@ucsb.edu&token=123456789\"> here <a/>`,
  };

  return exports.sendEmail(mailOptions);
};

exports.confirmTemplateHTML = fs.readFileSync("templates/confirm.html", {encoding:'utf8'});
