const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const wishlistController = {

    addToWishlist: async (req, res) => {
        const { productId} = req.body;
        console.log("req.body",req.body);
        try {
           
         let   userId = req.decoded._id;
            let wishlist = await Wishlist.findOne({ user: userId });
            console.log("wishlist",wishlist);
            let product = await Product.findOne({ _id: productId });
            console.log('product',product);
            if (!product) {
                return res.status(404).send('Item not found!');
            }
            const name = product.name;
            const description = product.description;
            const price = product.price;
            const quantity = 1;
            const image = product.image;
            if(wishlist){
                let productIndex = wishlist.products.findIndex(p => p.productId.equals(productId));

                if(productIndex >-1){
                    wishlist.products.splice(productIndex,1);
                    await wishlist.save();
                    return res.status(204).send();
                }
                else{
                    wishlist.products.push({productId, name,description,price, quantity,image});
                    wishlist = await wishlist.save();
                return res.status(201).send(wishlist);
                }
                
            }
            else{
                const newWishlist = await Wishlist.create({
                    user:userId,
                    products:[{productId,name,description,price,quantity,image}],

                });
                return res.status(201).send(newWishlist);
            }

        } catch (error) {
            console.error('Error adding to wishlist:', error);
            res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
        }
    },
    getWishlist: async(req,res) =>{
        const userId = req.decoded._id;
        try{
            let wishlist = await Wishlist.find({user:userId});
            if(wishlist && wishlist?.length>0){
                res.send({data:wishlist[0]});
            }
            else{
                res.send(null);
            }
        }catch(error){
            console.log(error);
            res.status(500).send("Somethin gwent wrong");
        }
    },
    deleteFromWishlist: async(req,res)=>{
        const userId = req.decoded._id;
        const productId = req.params.productId;
        try{
            let wishlist = await Wishlist.findOne({user:userId});
            if(!wishlist){
                return res.status(404).send('Cart not found');
            }

            wishlist.products.pull({productId});
            wishlist = await wishlist.save();

            res.status(201).send(wishlist);
        }catch(error){
            console.error('Error deleting product from wishlist',error);
            re.status(500).json({message:'Error deleting product from wishlist', error:error.message});
        }
    },
}

module.exports = wishlistController;
