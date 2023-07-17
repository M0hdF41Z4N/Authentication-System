// Importing Node Mailer
const nodeMailer = require('../config/nodemailer')


exports.resetPass = (user,type,link) => {

    // console.log("Inside reset mailer",user);

    // Send Mail function
    nodeMailer.transporter.sendMail({
        from:'jbide025@gmail.com',
        to:user.email,
        subject:"Reset Password",
        html:`
        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Hi ${user.name}</p>,
        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
        You have requested to reset your password</h1>
            <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
            
            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
            We cannot simply send you your old password. A unique link to reset your
            password has been generated for you. To reset your password, click the
            following link and follow the instructions.</p>

            <a href="${link}"
                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                Password</a>
        <p>If you did not make this request then please ignore this email.</p>
        `
        
    },(err,info) => {
        // For debugging purpose
        if (err) { console.log("Error in Sending mail.",err); return; }
        // console.log('Message sent',info);
        return;
    });
}

