const Product = require('../models/product');
const Notification = require('../models/notification');
const productController = {
  addProduct: async (req, res) => {
    try {
      const { name, description, price, sizes } = req.body;
      const image = req.file;

      const newProduct = new Product({
        name,
        description,
        price,
        image: image.path,
        sizes: {
          XS:sizes.includes('chota'),
          S: sizes.includes('small'),
          M: sizes.includes('medium'),
          L: sizes.includes('large'),
          XL: sizes.includes('vada'),
        },
      });

      await newProduct.save();
      const newNotification = new Notification({content:"New Product Added",type:1});
      await newNotification.save();
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding product: ', error);
      res.status(500).json({ message: 'Error adding product' });
    }
  },
  getProducts: async (req, res) => {
    try {
      let search = req.query.search || "";
      const regex = new RegExp(search,'i');
      const {page = 1, limit = 12 } = req.query;
      const skip = (page - 1) * limit;

      const productsCount = await Product.find({}).count().exec();
      let count = Math.ceil(productsCount/limit)
      const products = await Product.find({"name": {"$regex":regex}})
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .exec();
      res.status(200).json({products,count});
    } catch (error) {
      console.error('Error fetching products: ', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  },
  getProductsToAdmin:async(req,res)=>{
    try {
      const products = await Product.find({});
      const productCount = await Product.countDocuments();
      res.status(200).json({ products,productCount });
    } catch (error) {
      console.error('Error fetching products: ', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, description, price, sizes } = req.body;
      const image = req.file; // Check if this is correctly handled by multer
      console.log('req', image);
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name,
          description,
          price,
          image: image ? image.path : undefined,
          sizes,
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res
        .status(200)
        .json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product: ', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      console.log('product', product);
      console.log('productId', productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product by ID: ', error);
      res.status(500).json({ message: 'Error fetching product by ID' });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res
        .status(200)
        .json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
      console.error('Error deleting product: ', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  },
  productGraph: async(req,res)=>{
    try {
      const productGraph = await Product.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);
  
      res.json(productGraph);
    } catch (error) {
      console.error('Error fetching monthly user registrations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getTotalProducts: async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      res.status(200).json({ totalProducts });
    } catch (error) {
      console.error('Error fetching total products: ', error);
      res.status(500).json({ message: 'Error fetching total products' });
    }
  }
  // getPaginatedProducts: async (req, res) => {
  //   try {
  //     const { page = 1, limit = 10 } = req.query;
  //     const skip = (page - 1) * limit;

  //     const products = await Product.find()
  //       .skip(skip)
  //       .limit(limit)
  //       .exec();

  //     res.status(200).json(products);
  //   } catch (error) {
  //     console.error('Error fetching paginated products: ', error);
  //     res.status(500).json({ message: 'Error fetching paginated products' });
  //   }
  // },

  // getSizes: async(req,res)=>{
  //   try{
  //     const sizes = await Product.distinct('sizes');
  //     res.status(200).json(sizes);
  //   }catch(error){
  //     console.error("Error fetching product sizes",error);
  //     res.status(500).json({error:'Internal Server Error'});
  //   }
  // }
};

module.exports = productController;
