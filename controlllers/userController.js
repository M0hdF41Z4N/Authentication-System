const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports.register = async (req, res) => {
    const { name , email, password , confirm_password} = req.body;

    if (password!=confirm_password) {
      return res.redirect('back');
    }

    let user = await User.findOne({email:email});
    if (user) {
      return res.redirect('/login');
    }else {
      await User.create(req.body);
      return res.redirect('/login');
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