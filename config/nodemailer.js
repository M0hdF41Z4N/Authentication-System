// Importing node mailer
const nodemailer = require('nodemailer');
// Importing ejs
const ejs = require('ejs');
// Importing path
const path = require('path');

// Creating transporter to send email
let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: 'personMail@gmail.com',
      pass: 'Password'
    }
  });

// Email Template
let renderTemplate = (data,relativePath) => {
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function (err,template) {
            if (err) {console.log(err,"error in rendering template"); return;}
            mailHtml = template;
        }
    )
    return mailHtml;
}


module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}
