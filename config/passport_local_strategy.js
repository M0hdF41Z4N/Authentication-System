const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField:'email',
  // 
  passReqToCallback : true
},
  async function(req,email, password, done) {
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        req.flash('error','Invalid username / password'); 
        return done(null,false);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          req.flash('success',`${user.name}, You're Successfully Logged In`); 
          // console.log("It matches!")
          return done(null,user);
        }
        else {
          // console.log("Invalid password!");
          req.flash('error','Invalid username / password'); 
          return done(null, false);
        }
      });

      // if (!user || user.password != password) {
      //   return done(null, false);
      // }
      // return done(null, user); 
    }catch(err) {
      return done(err);
    }
      // find a user and estaiblish the identity
    // User.findOne({ email: email }, function (err, user) {
    //   if (err) {
    //     // req.flash('error',err);
    //     return done(err); }
    //   if (!user) {   
    //     // req.flash('error','Invalid username / password'); 
    //     return done(null, false); }
    //   if (!user.verifyPassword(password)) {   
    //     // req.flash('error','Invalid username / password'); 
    //     return done(null, false); 
    //   }
    //   return done(null, user);
    // });
  }
));

// Serializing
passport.serializeUser((user,done)=>{
  done(null,user.id);
});

// Deserializing
passport.deserializeUser(async (id,done)=>{
  try {
    let user = User.findById(id);
    return done(null,user);
  }catch (err) {
    console.log("Error in finding user --> Passport");
    return done(err);
  }
  // User.findById(id) ,(err,user) => {
  //     if (err) {
  //         console.log("Error in finding user --> Passport");
  //         return done(err);
  //     }
  //     return done(null,user);
  // });
});


// Check if user is authenticated
passport.checkAuthentication = function(request,response,next){
  // If user is signed in
  if (request.isAuthenticated()) {
    return next();
  }

  // if user is not signed in
  return response.redirect('/login');
  }

passport.setAuthenticatedUser = (request,response,next) => {
  if (request.isAuthenticated()) {
    // sending request user to local for the views
    response.locals.user = request.user;
  }

  next();
}

module.exports = passport;