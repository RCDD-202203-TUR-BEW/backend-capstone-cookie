const express = require('express');

const nodemailer = require('nodemailer');

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

module.exports = transporter;
