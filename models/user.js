// Importing mongoose
const mongoose = require('mongoose');

// Creating schema
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required: true,
        unique:true
    },
    password : {
        type : String,
        required: true
    },
    name : {
        type : String,
        required: true
    }
},{
    timestamps:true
});

// Creating model
const User = mongoose.model('User',userSchema);
// Exporting model
module.exports = User;