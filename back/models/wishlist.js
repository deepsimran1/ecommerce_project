const mongoose = require('mongoose');

const wishlistSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            name:String,
            description:String,
            price:Number,
            quantity: {
                type: Number,
                default: 1,
            },
            image:String,
        },
    ],
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
