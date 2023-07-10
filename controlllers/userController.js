const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passMailer = require('../mailers/pass_mailer');

module.exports.register = async (req, res) => {
    const { firstName , lastName , email, password , confirm_password} = req.body;
    // console.log(password);
    let name = firstName+" "+lastName;
    if (password!=confirm_password) {
      req.flash('error',`Passwords don't match`);
      return res.redirect('back');
    }

    let user = await User.findOne({email:email});
    if (user) {
      
      // Sending notification
      req.flash('error',`${email} , Already registered. Try with login.`);
      return res.redirect('/login');
    }
    // else {
    //   await User.create({name,email,password});
    //   return res.redirect('/login');
    // }
    else {
      bcrypt.hash(password, 10, async (err, hashedPassword) => { 
        if (err) {
          req.flash('error',"Internal Server Error");
          throw err;
        }
        let user = await User.create({name,email,password: hashedPassword});
        // sending mail on successfully registering
        console.log(user.email);
        passMailer.resetPass(user);
        req.flash('success',  `${name} , you're successfully registered with ${email}`);
        return res.redirect('/login');
      })
    }
    
  // Implement Bcrypt
    // bcrypt.hash(password, 10, (err, hashedPassword) => {
    //   if (err) throw err;
  
    //   const newUser = new User({
    //     username,
    //     password: hashedPassword,
    //   });
  
    //   newUser.save((err) => {
    //     if (err) throw err;
  
    //     res.redirect('/login');
    //   });
    // });
  }

  module.exports.login = (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('dashboard');
    }
    return res.render('login');
  }