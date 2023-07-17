// Importing passport
const passport = require('passport');
// Importing google strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy;
// Importing crypto
const crypto = require('crypto');
// Importing user model
const User = require('../models/user');

// Creating google strategy 
passport.use(new GoogleStrategy({
  // GOOGLE_CLIENT_ID
  clientID: 'GOOGLE_CLIENT_ID',
  // GOOGLE_CLIENT_SECRET
  clientSecret: 'GOOGLE_CLIENT_SECRET',
  callbackURL: "http://localhost:8000/auth/google/callback",
  passReqToCallback   : true
},
  async function(req,accessToken, refreshToken, profile, done) {
    try {
      // Finding User
    let user = await User.findOne({email: profile.emails[0].value});
    // If user found we simply return
    if (user) {
      // sending notification
        req.flash('success', `${user.name}, You're Successfully Logged In`);
        // sending user
          return done(null, user);
        }
        else {
              // Create User if user not found
              User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
              });
             // sending notification
              req.flash('success',  `${profile.displayName} Try login , you're successfully registered with ${profile.emails[0].value}`);
              // sending user
              return done(null, user);
            }

    }catch (err) {
      // For debugging purpose
      console.log("Error in passport google auth ",err);
      return;
    }
  }
));


module.exports = passport; 
