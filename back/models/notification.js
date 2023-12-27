const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    content: String,
    type: {
        type: Number,
        required: true,
        enum: [0, 1, 2]
    },
    read:{
        type:Boolean,
        default:false,
    }

}
,{timestamps:true}
);

const Notification = mongoose.model('Notification',notificationSchema);

module.exports = Notification;