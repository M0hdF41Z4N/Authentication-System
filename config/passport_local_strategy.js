// Importing passport
const passport = require('passport');
// Importing local strategy
const LocalStrategy = require('passport-local').Strategy;
// Importing user model
const User = require('../models/user');
// Importing bcrypt
const bcrypt = require('bcrypt');


// Creating new strategy
passport.use(new LocalStrategy({
  usernameField:'email',
  passReqToCallback : true
},
  async function(req,email, password, done) {
    try {
      // Finding user
      let user = await User.findOne({ email: email });
      // Case 1 : If user not found
      if (!user) {
        // Send notification / message
        req.flash('error','Invalid username / password'); 
        return done(null,false);
      }
      // else comparing/checking the password
      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          // sending notification
          req.flash('success',`${user.name}, You're Successfully Logged In`); 
          return done(null,user);
        }
        else {
          // sending notification
          req.flash('error','Invalid username / password'); 
          return done(null, false);
        }
      });
    }catch(err) {
      // For debugging purpose
      console.log("Error in passport local strategy",err);
      return done(err);
    }
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