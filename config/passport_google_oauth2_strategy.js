const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new GoogleStrategy({
  // GOOGLE_CLIENT_ID
  clientID: '965054862790-tj64di50jfooclbndcdbj6imjiv2m1mm.apps.googleusercontent.com',
  // GOOGLE_CLIENT_SECRET
  clientSecret: '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',
  callbackURL: "http://localhost:8000/auth/google/callback"
},
  function(accessToken, refreshToken, profile, done) {
    // Finding User
    console.log(accessToken) ;
    console.log(refreshToken) ;
    console.log(profile);
    User.findOrCreate({ email: profile.emails[0].value }).exec(function(err, user) {
      // Error occured in finding user
      if (err) {
        console.log('Error in google login', err);
        return;
      }
      // User found
      if (user) {
        return done(null, user);
      }else {
        // Create User if user not found
        User.create({
          name:profile.displayName,
          email:profile.emails[0].value,
          password:crytpo.randomBytes(20).toString('hex')
        },function (err,user) {
          // Error occured while creating user
          if(err) {
            console.log('Error in creating user',err);
            return;
          }
          return done(null,user);
        })
      }
    });
  }
));


module.exports = passport; 