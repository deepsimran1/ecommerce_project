const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    mobile:Number,
    dob:Date,
    alternativeMob:Number,
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;
