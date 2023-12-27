const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
            size: String,
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
