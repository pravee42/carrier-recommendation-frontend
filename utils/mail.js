const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.ridemap@gmail.com', // your Gmail account
    pass: 'rvrqunepdqxudvfa',
  },
});

const mailTemplate = (userId, sId, tranieeName) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Welcome Email</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
        }
        .logo {
            width: 200px;
            padding: 20px 0;
        }
        .header {
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
        }
        .message {
            color: #666;
            line-height: 1.6;
            margin: 20px 0;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #5CC6D0;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .section-title {
            font-size: 24px;
            font-weight: bold;
            margin: 30px 0 20px;
            color: #333;
        }
        .checklist-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            color: #666;
        }
        .checklist-item:before {
            content: "✓";
            color: #5CC6D0;
            margin-right: 10px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            margin-top: 40px;
        }
        .address {
            text-align: center;
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://i.ibb.co/QnR1m9p/download-1.jpg" alt="Company Logo" class="logo">
        
        <div class="header">
            Welcome 👋
        </div>
        
        <div class="message">
            You are assigned as an supervisor to Mr/Ms. ${tranieeName}. Kindly fill the evaluation form for Level-3
        </div>
        
        <a href="http://localhost:3000/l1" class="cta-button">Evaluate Level - 3</a>
        
        <div class="section-title">
            Level - 3
        </div>
        
        <div class="checklist-item">Memory</div>
        <div class="checklist-item">Cycle Time</div>
        
        <div class="message">
            You are receiving this email because you signed up for Lucas TVS.
        </div>
        
        <div class="footer">
            Made for you with 💙 from Ridemap
        </div>
        
        <div class="address">
           10, Kothapurinatham Main Rd, <br > Thiruvandarkoil, <br >Puducherry 605501
        </div>
    </div>
</body>
</html>`;
};

const sendMailToSuperVisor = async (mailId, userId, sId, tranieeName) => {
  await transporter.sendMail({
    from: 'info.ridemap@gmail.com',
    to: mailId,
    subject: 'New Assignment: Trainee Supervision',
    html: mailTemplate(userId, sId, tranieeName),
  });
};

module.exports = {sendMailToSuperVisor};
