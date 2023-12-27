const Cart = require('../models/cart');
const Product = require('../models/product');
const cartController = {

    addToCart: async (req, res) => {
        // let userId = req.params.id;
        const { productId, quantity,size} = req.body;
        console.log("req.body",req.body);
        try {
           
         let   userId = req.decoded._id;
            let cart = await Cart.findOne({ user: userId });
            console.log("cart",cart);
            let product = await Product.findOne({ _id: productId });
            console.log('product',product);
            if (!product) {
                return res.status(404).send('Item not found!');
            }
            const { name, description, price, image, sizes } = product;

            if(cart){
                let productIndex = cart.products.findIndex(p => p.productId.equals(productId));

                if(productIndex >-1){
                    cart.products[productIndex].quantity += 1;
                    if (size && Array.isArray(sizes) && sizes.includes(size)) {
                        cart.products[productIndex].size = size;
                      }           
                }
                else{
                    cart.products.push({productId, name,description,price, quantity,image,size: size || ''});
                }
                cart = await cart.save();
                return res.status(201).send(cart);
            }
            else{
                const newCart = await Cart.create({
                    user:userId,
                    products:[{productId,name,description,price,quantity,image,size:size || ''}],

                });
                return res.status(201).send(newCart);
            }

        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Error adding to cart', error: error.message });
        }
    },
    getCart: async(req,res) =>{
        const userId = req.decoded._id;
        try{
            let cart = await Cart.find({user:userId});
            if(cart && cart?.length>0){
                res.send({data:cart[0]});
                console.log("cart",cart[0]);
            }
            else{
                res.send(null);
            }
        }catch(error){
            console.log(error);
            res.status(500).send("Somethin gwent wrong");
        }
    },
    deleteFromCart: async(req,res)=>{
        const userId = req.decoded._id;
        const productId = req.params.productId;
        try{
            let cart = await Cart.findOne({user:userId});
            if(!cart){
                return res.status(404).send('Cart not found');
            }

            cart.products.pull({productId});
            cart = await cart.save();

            res.status(201).send(cart);
        }catch(error){
            console.error('Error deleting product from cart',error);
            re.status(500).json({message:'Error deleting product from cart', error:error.message});
        }
    },
    updateCartItemQuantity: async (req,res) =>{
        const userId = req.decoded._id;
        const productId = req.params.productId;
        console.log("productid",productId);
        const {quantity} = req.body;
        console.log("quantity",quantity);
        try{
            let cart = await Cart.findOne({user: userId});
            if (!cart){
                return res.status(404).send('Cart not found');
            }
            let productIndex = cart.products.findIndex(p =>p.productId.equals(productId));

            if (productIndex > -1){
                let productItem = cart.products[productIndex];
                productItem.quantity = quantity;
                cart.products[productIndex] = productItem;

                cart = await cart.save();
                res.status(200).send(cart);
            }else{
                res.status(404).send('Product not found in the cart');
            }
        }catch(error){
            console.error('Error updating quantity:',error);
            res.status(500).json({message: 'Error updating quantity',error:error.message});
        }
    },
    checkProductInCart:async(req,res)=>{
        try {
            const userId = req.decoded._id;// Assuming you have the user ID in the request object after authentication
            const productId = req.params.productId;
        
            // Check if the product with productId is in the user's cart
            const cart = await Cart.findOne({ userId });
            const inCart = cart.products.some(product => product.productId === productId);
        
            res.status(200).json({ inCart });
          } catch (error) {
            console.error('Error checking product in cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
};

module.exports = cartController;
