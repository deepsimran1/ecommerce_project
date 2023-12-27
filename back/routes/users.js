const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../../back/user/controllers/userController');
const token = require('../middleware/token');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const adminController = require('../controllers/adminController');
const wishlistController = require('../controllers/wishlistController');
const contactController = require('../controllers/contactController');
const contactusController = require('../controllers/contactusController');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
const notificationController = require('../controllers/notificationController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '---' + file.originalname);
  },
});



const upload = multer({ storage: storage });


//user routes
router.post('/submitForm', upload.array('images'), userController.submitForm);
router.post('/login', userController.login);
router.get('/user', token.verify, userController.user);
router.post('/otp', userController.otp);
router.post('/forgetPass', userController.forgetPass);
router.post('/resetPass', userController.resetPass);
router.put('/user', token.verify, userController.updateUser);
//product routes
router.post('/addProduct', upload.single('image'),token.verify, productController.addProduct);
router.get('/product', productController.getProducts);
router.get('/getProductsToAdmin',productController.getProductsToAdmin);
//cart routes
router.post('/addToCart', token.verify, cartController.addToCart);
router.get('/getCart', token.verify, cartController.getCart);
router.delete('/deleteFromCart/:productId', token.verify, cartController.deleteFromCart);
router.put('/updateCartItem/:productId', token.verify, cartController.updateCartItemQuantity);
//admin routes
router.post('/adminSignup',upload.single('image'),adminController.adminSignup);
router.post('/admin', adminController.adminLogin);
router.get('/adminProfile', token.verify, adminController.adminProfile);
router.put('/adminProfile', token.verify, adminController.adminProfile);
router.post('/verifyEmail', adminController.verifyEmail);
router.post('/forgetAdminPass',adminController.forgetAdminPass);
router.post('/resetAdminPass',adminController.resetAdminPass);
router.get('/getProductById/:id',token.verify ,productController.getProductById);
router.put('/updateProduct/:id',token.verify,upload.single('image'), productController.updateProduct);
router.delete('/deleteProduct/:id', token.verify,productController.deleteProduct);
router.get('/getUsers',token.verify,userController.getUsers);
router.get('/getUserById/:id',userController.getUserById);
router.put('/updateUserByAdmin/:id',userController.updateUserByAdmin);
router.delete('/deleteUser/:id',token.verify,userController.deleteUser);
router.post('/addCustomer',token.verify , userController.addCustomer);
router.put('/editAdmin', token.verify, upload.single('image'), adminController.editAdmin);
router.post('/addToWishlist',token.verify,wishlistController.addToWishlist);
router.get('/getWishlist', token.verify, wishlistController.getWishlist);
router.delete('/deleteFromWishlist/:productId', token.verify, wishlistController.deleteFromWishlist);
// router.get('/getSizes',token.verify,productController.getSizes);
router.get('/checkProductInCart/:productId',token.verify,cartController.checkProductInCart);
router.get('/monthlyReg',token.verify,userController.monthlyReg);
router.get('/productGraph',token.verify,productController.productGraph);
router.get('/getTotalProducts', productController.getTotalProducts);
router.get('/getTotalUsers', userController.getTotalUsers);
// router.get('/getPaginatedProducts',productController.getPaginatedProducts);
router.post('/addContactMessage',contactusController.addContactMessage);
router.post('/addContent', contactController.addcontent);
router.get('/getcontent',contactController.getcontent);
router.get('/getContactUsers',token.verify,contactusController.getContactUsers);
router.delete('/deleteContactUser/:id',token.verify,contactusController.deleteContactUser);
router.put('/updateContactUserByAdmin/:id',token.verify,contactusController.updateContactUserByAdmin);
// router.get('/getContactFormCount',contactusController.getContactFormCount);
router.post('/createBlog',token.verify,upload.single('image'),blogController.createBlog);
router.get('/getAdminBlogs',token.verify,blogController.getAdminBlogs);
router.delete('/deleteBlog/:blogId', token.verify, blogController.deleteBlog);
router.get('/getBlog/:blogId', token.verify, blogController.getBlog);
router.put('/updateBlog/:blogId', token.verify, blogController.updateBlog);
router.get('/getAllBlogs', blogController.getAllBlogs);
router.delete('/deleteBlogWithoutAdminId/:blogId', token.verify, blogController.deleteBlogWithoutAdminId);
router.get('/getBlogDetails/:blogId',blogController.getBlogDetails);
router.post('/addComment',token.verify,commentController.addComment);
router.get('/getComments/:blogId',commentController.getComments);
router.post('/like/:blogId', token.verify,blogController.likeBlog);
router.get('/getNotification',notificationController.getNotification);
router.patch('/readNotification/:id/read',notificationController.markNotificationAsRead);
router.get('/getunreadNotification',notificationController.getunreadNotification);
router.get('/getLoggedInUser',token.verify,userController.getLoggedInUser);
router.put('/editComment/:commentId',token.verify,commentController.editComment);
router.delete("/deleteComment/:commentId",token.verify,commentController.deleteComment);
module.exports = router;


