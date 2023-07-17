// Importing mongoose
const mongoose = require('mongoose');

const uri = "mongodb+srv://user:password@cluster0.qghc4gy.mongodb.net/?retryWrites=true&w=majority";

main().catch(err => console.log(err));

async function main() {
  // For local DB
  // await mongoose.connect('mongodb://127.0.0.1:27017/social_media_db');
  await mongoose.connect(uri);
}

// For debugging purpose

console.log("Successfully Connected to DB");
