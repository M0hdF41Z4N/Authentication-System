// Importing mongoose
const mongoose = require('mongoose');

const uri = "mongodb+srv://root:toor@cluster0.qghc4gy.mongodb.net/?retryWrites=true&w=majority";

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/social_media_db');
  await mongoose.connect(uri);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// For debugging purpose

console.log("Successfully Connected to DB");