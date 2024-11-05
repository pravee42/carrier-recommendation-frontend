const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'info.ridemap@gmail.com', // your Gmail account
      pass: "rvrqunepdqxudvfa"
    },
  });


  