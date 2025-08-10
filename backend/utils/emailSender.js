const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, html, attachments = [] }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments
  });
};

module.exports = sendMail;
// const transporter = nodemailer.createTransport({
//   service: "Gmail", // or your SMTP provider
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
