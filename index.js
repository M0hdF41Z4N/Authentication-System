const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const passportGoogleAuth = require('./config/passport_google_oauth2_strategy');
const path = require('path');
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');

// Using Layouts
app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use(express.static('./assets'));

// Set-up application/x-www-form-urlencoded parser
app.use(express.urlencoded({extended:false}));
// Set up cookie parser
app.use(cookieParser());

// app.use('/',require('./routes'));

// Configuring to db
const db = require('./config/database');

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name:'Authentication System',
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: (1000*60*1000)
    },
    // store : new MongoStore({
    //   mongooseConnection: db,
    //   autoRemove:'disabled'
    // },
    // function (err) {
    //   console.log(err || 'connect-mongodb setup ok')
    // })
    store: MongoStore.create({mongoUrl:'mongodb://127.0.0.1:27017/social_media_db'})
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Set up routes
app.use('/', indexRoute);
app.use('/', authRoute);

// Start the server

app.listen(8000,function(err) {
    if (err) {
        console.log(`Error in starting server.`)
    }
    console.log('Server is running on port 8000');
});





