
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    password: String,
    otp:String,
    verified:{type:Boolean,default:false},
    resetToken:String,
    resetTokenExpiry:Date,
    image:String,
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
