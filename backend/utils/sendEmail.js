const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent ✅");
    console.log("EMAIL:", process.env.EMAIL_USER);
    console.log("PASS:", process.env.EMAIL_PASS);

  } catch (err) {
    console.log("Email error ❌", err);
  }
};

module.exports = sendEmail;