const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user');
const Token = require('../models/token');
const passMailer = require('../mailers/pass_mailer');


// Controller to handle registration of user
module.exports.register = async (req, res) => {
    // Getting all inputs
    const { firstName , lastName , email, password , confirm_password} = req.body;
    let name = firstName+" "+lastName;
    
    // Case 1 : if passwords does'nt match
    if (password!=confirm_password) {
      // sending notification
      req.flash('error',`Passwords don't match`);
      // redirecting to register
      return res.redirect('back');
    }

    // Finding user
    let user = await User.findOne({email:email});
    // Case 2 : If user already exists
    if (user) {
      
      // Sending notification
      req.flash('error',`${email} , Already registered. Try with login.`);
      // Redirecting to login page
      return res.redirect('/login');
    }
    // Case 3 : Create new user
    else {
      // First hasing the password
      bcrypt.hash(password, 10, async (err, hashedPassword) => { 
        if (err) {
          req.flash('error',"Internal Server Error");
          throw err;
        }
        // Create user
        let user = await User.create({name,email,password: hashedPassword});
        req.flash('success',  `${name} , you're successfully registered with ${email}`);
        // Redirecting to login page
        return res.redirect('/login');
      })
    }
  }

  // Controller to handle the login
  module.exports.login = (req, res) => {
    // Case 1:  if user is autheticated
    if (req.isAuthenticated()) {
      // redirect to user dashboard
      return res.redirect('dashboard');
    }
    // Case 2: else , redirect to login page
    return res.render('login');
  }

// Controller for dashboard view
module.exports.dashboard =  async (req, res) => {
  try {
    let id = req.session.passport.user ;
    let user = await User.findById(id);
    

    if (user) {
      res.render('dashboard',{title:"Dashboard",user:user});
    }else {
      res.render('dashboard',{title:"Dashboard"});
    }
  }catch(err) {
    console.log("Error in dashboard view",err);
    return;
  }
  
  
}

module.exports.reset = async (req,res) => {
  try {
    // Getting user id from session
    let id = req.session.passport.user ;
    // Finding user
    let user = await User.findById(id);
    // Getting passwords
    const { password , confirm_password} = req.body;
    //  Case 1 : Matching password
    if (password!=confirm_password) {
      // Showing notification
      req.flash('error',`Passwords don't match`);
      // Redirecting back
      return res.redirect('back');
    }
    // Case 2 : if user not exists
    if (!user) {
      // Showing notification
      req.flash('error',`User not found`);
      // Redirecting back
      return res.redirect('back');
    }
    // Case 2 : If user found
    if (user) {
      // hasing the password
      bcrypt.hash(password, 10, async (err, hashedPassword) => { 
        // If there's an error
        if (err) {
          // Showing notification
          req.flash('error',"Internal Server Error");
          // throwing error
          throw err;
        }
        // Updating user
        let user = await User.findByIdAndUpdate(id,{ $set : {password: hashedPassword}});
        // Saving user
        await user.save();
        // Showing notification
        req.flash('success',  `${user.name} , password reset succesfull.`);
        // Redirecting to dashboard
    return res.redirect('/dashboard');
      });
    }
  }catch(err) {
    // For debugging purpose
    console.log("Error in reset view",err);
    return;
  }
}

module.exports.forgotPassword = async (req,res) => {
  try {
    // Getting email 
    let {email} = req.body;
    // Finding user with email
    let user = await User.findOne({email:email});
    // Case 1 : if user not found
    if (!user) {
      req.flash('error',`User not found with given email`);
      return res.redirect('back');
    }
    // Creating token 
    let token = await Token.findOne({userId:user._id});
    // Case 2 : if token not found
    if (!token) {
      // Create new token
      token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
      }).save();
      // Generating password reset link
      let link = `http://localhost:8000/password-reset/${user._id}/${token.token}`;
      // Send email
      passMailer.resetPass(user,"Password reset",link);
      // await sendEmail(user,"Password reset",link);
      req.flash('success','password reset link sent to your email account');
      return res.redirect('back');
  }
  } catch(err) {
    // For debugging purposes
    console.log("Error in forget password controller : ",err);
    return;
  }
}

module.exports.resetPassword = async (req,res) => {
  try {
    //  Getting password
    const { password , confirm_password} = req.body;
    let userId = req.params.userId;
    // First find the user
    const user = await User.findById(req.params.userId);
    // Case 1 : if user not found
    if (!user) {
      // Showing notification
      req.flash('error','invalid link or expired');
      return res.redirect('/');
    }
    // finding token
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
      });
    // Case 2 : if token not found
    if (!token) {
      // Showing notification
      req.flash('error','invalid link or expired');
      return res.redirect('/');
    }
    // Case 3 : if password don't match
    if (password!=confirm_password) {
      // Showing notification
      req.flash('error',`Passwords don't match`);
      return res.redirect('back');
    }
    // Case 4 : if user is found
    if (user) {
      // Hashing the password
      bcrypt.hash(password, 10, async (err, hashedPassword) => { 
        if (err) {
          req.flash('error',"Internal Server Error, Try again.");
          throw err;
        }
        // Updating User
        let user = await User.findByIdAndUpdate(userId,{ $set : {password: hashedPassword}});
        // Saving User
        await user.save();
        // Showing notification
        req.flash('success',  `${user.name} , password reset succesfull !Try login.`);
        // Redirect to login
        return res.redirect('/login');
      });
    }

  }catch(err) {
    // For debugging purposes
    console.log("Error in reset password link controller : ",err);
    return;
} 
}