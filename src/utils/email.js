const nodemailer = require('nodemailer');

const sendEmail = async (user, randomstr) => {
  const { email, username } = user;
  const output = `<h2>Welcome ${username}</h2>
  <h3>
    We just need to verify your email address before you can access Cookiez.
    <br>
    Verify your email address by clicking <a href="http://localhost:3000/api/auth/verifyEmail?code=${randomstr}&email=${email}">here</a>
    <br> Thanks! <br>
    -The Cookiez team
    </h3>`;

  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    host: 'smtp.office365.com',
    port: '587',
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    auth: {
      user: 'cookiesrecoded@outlook.com',
      pass: 'kishialwayslagging01',
    },
  });

  await transporter.sendMail({
    from: 'cookiesrecoded@outlook.com',
    to: email,
    subject: 'Cookiez Verification',
    html: output,
  });
};

module.exports = sendEmail;
