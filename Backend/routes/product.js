const express = require('express');
const {
    getProducts,
    createProduct,
    productsByUser,
    productsById,
    isPoster,
    updateProduct,
    deleteProduct,
    singleProduct,
} = require('../controllers/product');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createProductValidator } = require('../validator');

const router = express.Router();

router.get('/products', getProducts);
// post routes
router.post('/product/new/:userId', requireSignin, createProduct, createProductValidator);
router.get('/product/by/:userId', requireSignin, productsByUser);
router.get('/product/:productId', singleProduct);
router.put('/product/:productId', requireSignin, isPoster, updateProduct);
router.delete('/product/:productId', requireSignin, isPoster, deleteProduct);
// photo
// router.get('/post/photo/:prodcutId', photo);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :productId, our app will first execute postById()
router.param('productId', productsById);

module.exports = router;
