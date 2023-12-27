const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    type:{
         type: String,
        enum:[0,1,2],//0-privacy,1-terms,2-about-us
        default:0
    },
    description:String,
},
{timestamps:true}
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;