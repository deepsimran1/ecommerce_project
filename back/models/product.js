const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    image:String,
    sizes: {
        XS:Boolean,
        S: Boolean,
        M: Boolean,
        L: Boolean,
        XL:Boolean,
    }
    
},
{timestamps:true}
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;