const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
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
    res.redirect('/');
  });
});

router.get('/dashboard', passport.checkAuthentication,(req, res) => {
  res.render('dashboard',{title:"Dashboard"},);
});

router.get('/auth/google',passport.authenticate('google',{scope: ['profile','email']}));
router.get(
  '/auth/google/callback',
  passport.authenticate(
    'google',
    {failureRedirect:'/login'})
    ,userController.login);



module.exports = router;
