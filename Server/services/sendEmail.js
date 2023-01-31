const nodemailer = require("nodemailer");

const sentResetMail = async (userEmail, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "prorespass@gmail.com",
      pass: "dmrmowoyxpoeidrp",
    },
    from: "prorespass@gmail.com",
  });

  const info = await transporter.sendMail({
    from: "localhost <prorespass@gmail.com>",
    to: userEmail,
    subject: "Reset Password",
    text: `http://localhost:3000/resetpassword/${token}`,
    html: `http://localhost:3000/resetpassword/${token}`,
  });

  return info;
};

module.exports = sentResetMail;
