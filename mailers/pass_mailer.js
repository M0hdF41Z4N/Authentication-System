const nodeMailer = require('../config/nodemailer')

exports.resetPass = (user) => {
    console.log("Inside reset mailer",user);
    nodeMailer.transporter.sendMail({
        from:'t3st3r123@gmail.com',
        to:user.email,
        subject:"Reset Password",
        html:'<h1>Yup, I received a mail.</h1>'
    },(err,info) => {
        if (err) { console.log("Error in Sending mail.",err); return; }
        console.log('Message sent',info);
        return;
    });
}