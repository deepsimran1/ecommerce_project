const mongoose = require('mongoose');

const contactusSchema = new mongoose.Schema({
    name:String,
    email:String,
    message:String,
},
{timestamps:true}
);

const ContactUs = mongoose.model('ContactUs', contactusSchema);

module.exports = ContactUs;