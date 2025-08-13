const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,            // STARTTLS
  requireTLS: true,         // force l'upgrade TLS
  auth: {
    user: process.env.NODEMAILER_USER,     // ton email complet
    pass: process.env.NODEMAILER_PASSWORD, // mot de passe ou app password
  },
  // PAS de tls.servername ici
  connectionTimeout: 30_000,
});

const sendMail = async ({ to, subject, html, attachments = [] }) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
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
