const express = require('express');
const router = express.Router();
const passport = require('passport');
// const bcrypt = require('bcrypt');
const User = require('../models/user');
const userController = require('../controlllers/userController');

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('dashboard');
  }
  return res.render('login',{title:"Login"});
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('dashboard');
  }
  return res.render('register',{title:"Register"});
});

router.post('/register', userController.register);

// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success',"Succefully logged out");
    res.redirect('/');
  });
});

router.get('/dashboard', passport.checkAuthentication , userController.dashboard);


router.get('/reset', passport.checkAuthentication , async (req,res) => {
  let id = req.session.passport.user ;
  let user = await User.findById(id);
  return res.render('reset',{title:'Reset Password'});
});

router.post('/reset', passport.checkAuthentication,userController.reset);


router.get('/forgotPassword',(req,res) => {
  return res.render('forgotPassword',{title:"Forgot Password"});
})
router.post('/forgotPassword',userController.forgotPassword);

router.post("/password-reset/:userId/:token", userController.resetPassword);
router.get("/password-reset/:userId/:token",(req,res) => {
  const userId = req.params.userId;
  const token = req.params.token;
  return res.render('passwordResetLink',{title:"Reset Password",userId:userId,token:token});
});



router.get('/auth/google',passport.authenticate('google',{scope: ['email','profile']}));
router.get(
  '/auth/google/callback',
  passport.authenticate(
    'google',
    {
      failureRedirect:'/login',
      successRedirect: '/dashboard',
    }));



module.exports = router;
