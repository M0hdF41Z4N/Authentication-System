# Authentication-System

Authentication System application based on Node JS and MongoDB.

How to Setup Project on local System
1. First setup npm package using `npm init`
2. Install the required dependencies as mentioned below.Using `npm install`<br> 
  └── bcrypt@5.1.0<br>
  ├── connect-flash@0.1.1<br>
  ├── connect-mongo@5.0.0<br>
  ├── cookie-parser@1.4.6<br>
  ├── crypto@1.0.1<br>
  ├── ejs@3.1.9<br>
  ├── express-ejs-layouts@2.5.1<br>
  ├── express-ejs@2.0.0<br>
  ├── express-session@1.17.3<br>
  ├── express@4.18.2<br>
  ├── mongoose@7.3.0<br>
  ├── nodemailer@6.9.3<br>
  ├── nodemon@2.0.22<br>
  ├── passport-google-oauth@2.0.0<br>
  ├── passport-google-oauth2@0.2.0<br>
  ├── passport-local@1.0.0<br>
  ├── passport@0.6.0<br>
  └── redis@4.6.7<br>
3. Configure files
  1. config/database.js with your creds
  2. config/nodemailer with your creds
  3. config/passport_google_oauth2_strategy.js with your creds
  4. mailers/passmailer with your email template
4. Run the server `nodemon index.js`
